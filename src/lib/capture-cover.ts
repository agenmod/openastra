export function captureGameCover(gameId: string) {
  return new Promise<string | null>((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("title", "cover-capture");
    iframe.style.cssText =
      "position:fixed;left:-2400px;top:0;width:1280px;height:800px;opacity:0;pointer-events:none;border:0";

    let settled = false;
    const finish = (data: string | null) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
      iframe.remove();
      resolve(data);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.type !== "openastra-cover") return;
      finish(typeof event.data.data === "string" ? event.data.data : null);
    };

    const timer = window.setTimeout(() => finish(null), 5000);
    window.addEventListener("message", onMessage);
    iframe.src = `/api/games/${gameId}/html?capture=1`;
    document.body.appendChild(iframe);
  });
}
