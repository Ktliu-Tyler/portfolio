'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    // Transparent background to work with both dark and light modes

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Transparent
    container.appendChild(renderer.domElement)

    // Create floating particles
    const particleCount = 80
    const particles: THREE.Mesh[] = []
    const particleColors = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0xa855f7, 0x3b82f6]

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 0.15 + 0.05
      const geometry = new THREE.IcosahedronGeometry(size, 0)
      const material = new THREE.MeshPhongMaterial({
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        transparent: true,
        opacity: 0.6,
        shininess: 100,
      })
      const particle = new THREE.Mesh(geometry, material)

      particle.position.x = (Math.random() - 0.5) * 16
      particle.position.y = (Math.random() - 0.5) * 12
      particle.position.z = (Math.random() - 0.5) * 8
      particle.rotation.x = Math.random() * Math.PI
      particle.rotation.y = Math.random() * Math.PI

      scene.add(particle)
      particles.push(particle)
    }

    // Create wireframe geometric shapes
    const shapes: THREE.Mesh[] = []
    const shapeGeometries = [
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
      new THREE.IcosahedronGeometry(0.35, 0),
    ]

    for (let i = 0; i < 6; i++) {
      const geometry = shapeGeometries[i % shapeGeometries.length]
      const material = new THREE.MeshPhongMaterial({
        color: particleColors[i % particleColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
      const shape = new THREE.Mesh(geometry, material)

      shape.position.x = (Math.random() - 0.5) * 12
      shape.position.y = (Math.random() - 0.5) * 8
      shape.position.z = (Math.random() - 0.5) * 4
      shape.rotation.x = Math.random() * Math.PI

      scene.add(shape)
      shapes.push(shape)
    }

    // Lighting
    const light1 = new THREE.DirectionalLight(0x6366f1, 0.8)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.DirectionalLight(0x8b5cf6, 0.5)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const light3 = new THREE.DirectionalLight(0x06b6d4, 0.3)
    light3.position.set(0, 5, -5)
    scene.add(light3)

    const ambientLight = new THREE.AmbientLight(0x404060, 0.8)
    scene.add(ambientLight)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      // Animate particles
      particles.forEach((particle, i) => {
        particle.rotation.x += 0.002 + i * 0.0002
        particle.rotation.y += 0.003 + i * 0.0001
        particle.position.y += Math.sin(time + i * 0.5) * 0.002
        particle.position.x += Math.cos(time * 0.5 + i * 0.3) * 0.001
      })

      // Animate wireframe shapes
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.003 + i * 0.001
        shape.rotation.y += 0.005 + i * 0.001
        shape.position.y = Math.sin(time * 0.3 + i * 2) * 1.5 + (i - 2.5) * 1.5
      })

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
