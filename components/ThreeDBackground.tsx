'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xfafafa)

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create rotating cubes
    const cubes: THREE.Mesh[] = []
    const colors = [0x3b82f6, 0x06b6d4, 0x8b5cf6, 0xec4899]

    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      const material = new THREE.MeshPhongMaterial({ color: colors[i] })
      const cube = new THREE.Mesh(geometry, material)

      cube.position.x = (i % 2) * 2.5 - 1.25
      cube.position.y = Math.floor(i / 2) * 2.5 - 1.25
      cube.rotation.x = Math.random() * Math.PI
      cube.rotation.y = Math.random() * Math.PI

      scene.add(cube)
      cubes.push(cube)
    }

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.005 + index * 0.001
        cube.rotation.y += 0.008 + index * 0.001
        cube.position.z = Math.sin(Date.now() * 0.0005 + index) * 0.5
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
