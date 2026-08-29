import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { renderStackSvg } from "../src/render.js";

const port = Number(process.env.STACK_MARQUEE_PORT || 4173);
const root = new URL("../public/", import.meta.url);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === "/v1/health") {
      response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      return response.end(JSON.stringify({ ok: true, renderer: "v1", local: true }));
    }
    if (url.pathname === "/v1/stack.svg") {
      const result = renderStackSvg(url);
      response.writeHead(result.status, {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": result.status === 200 ? "public, max-age=31536000, immutable" : "no-store"
      });
      return response.end(request.method === "HEAD" ? undefined : result.svg);
    }

    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
    let fileUrl = new URL(`.${safePath}`, root);
    try {
      if (!(await stat(fileUrl)).isFile()) throw new Error("not a file");
    } catch {
      fileUrl = new URL("index.html", root);
    }
    const body = await readFile(fileUrl);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(fileUrl.pathname)] || "application/octet-stream",
      "Cache-Control": fileUrl.pathname.endsWith("index.html") ? "no-cache" : "public, max-age=3600"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Local server error: ${error.message}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`README Stack is running at http://127.0.0.1:${port}`);
});
