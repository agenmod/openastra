import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CAPTURE_SCRIPT = `<script>
(function () {
  function jpeg(source) {
    var maxW = 1280, maxH = 800;
    var w = source.width, h = source.height;
    if (!w || !h) return null;
    var out = source;
    if (w > maxW || h > maxH) {
      var scale = Math.min(maxW / w, maxH / h);
      out = document.createElement("canvas");
      out.width = Math.round(w * scale);
      out.height = Math.round(h * scale);
      out.getContext("2d").drawImage(source, 0, 0, out.width, out.height);
    }
    return out.toDataURL("image/jpeg", 0.82);
  }
  function poster() {
    var c = document.createElement("canvas");
    c.width = 1280;
    c.height = 800;
    var g = c.getContext("2d");
    var bg = getComputedStyle(document.body).backgroundColor || "#07070c";
    g.fillStyle = bg;
    g.fillRect(0, 0, 1280, 800);
    g.fillStyle = "#f4f1ff";
    g.font = "700 64px system-ui,sans-serif";
    var title = (document.title || "openAstra").slice(0, 28);
    g.fillText(title, 72, 400);
    return c.toDataURL("image/jpeg", 0.82);
  }
  function shot() {
    try {
      var node = document.querySelector("canvas");
      var data = node ? jpeg(node) : null;
      parent.postMessage({ type: "openastra-cover", data: data || poster() }, "*");
    } catch (err) {
      parent.postMessage({ type: "openastra-cover", data: null }, "*");
    }
  }
  setTimeout(shot, 1400);
})();
</script>`;

function injectCapture(html: string) {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${CAPTURE_SCRIPT}</body>`);
  }
  return `${html}${CAPTURE_SCRIPT}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const capture = new URL(req.url).searchParams.get("capture") === "1";
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) {
    return new NextResponse("Not found", { status: 404 });
  }

  const session = await readSession();
  const isAuthor = Boolean(session && session.id === game.authorId);
  if (!game.published && !isAuthor) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (capture && !isAuthor) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = capture ? injectCapture(game.html) : game.html;
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'",
      "Cache-Control": "no-store",
    },
  });
}
