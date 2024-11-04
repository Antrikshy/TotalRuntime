import axios from "axios"
import { PUBLIC_BACKEND_REVERSE_PROXY_PORT } from "$env/static/public";

export async function GET({ request }) {
  return new Response(
    (await axios.get(`https://${request.headers.get("host")}:${PUBLIC_BACKEND_REVERSE_PROXY_PORT}/sitemap`)).data,
    { headers: { "Content-Type": "application/xml" } }
  )
}
