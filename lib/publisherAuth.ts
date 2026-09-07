import { authorizeAdmin } from './adminAuth'
export async function validatePublisherRequest(request: Request) { return authorizeAdmin(request, true) }
