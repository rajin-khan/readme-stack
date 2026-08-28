import { renderStackSvg } from "./render.js";

const svgHeaders = (status) => ({
  "Content-Type": "image/svg+xml; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": status === 200
    ? "public, max-age=31536000, s-maxage=31536000, immutable"
    : "no-store"
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    if (url.pathname === "/v1/health") {
      return Response.json({ ok: true, renderer: "v1" }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/v1/stack.svg") {
      const result = renderStackSvg(url);
      return new Response(request.method === "HEAD" ? null : result.svg, {
        status: result.status,
        headers: svgHeaders(result.status)
      });
    }
    return env.ASSETS.fetch(request);
  }
};
