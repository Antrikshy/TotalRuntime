import axios from "axios"
import { PUBLIC_BACKEND_REVERSE_PROXY_PORT } from '$env/static/public';

export async function GET() {
  return new Response(
    (await axios.get(`http://localhost:${PUBLIC_BACKEND_REVERSE_PROXY_PORT}/sitemap`)).data,
    { headers: { 'Content-Type': 'application/xml' } }
  )
}
