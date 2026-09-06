#!/usr/bin/env python3
"""Visit live play URLs and capture viewport screenshots for missing covers."""

from __future__ import annotations

import asyncio
import json
import subprocess
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path("/Volumes/T92T/AIcodedesk/AIdianzi/aaagame")
COVER_DIR = ROOT / "public/astra"
ITEMS = json.loads(Path("/tmp/astra-need-shots.json").read_text())
REPORT = Path("/tmp/astra-shot-report.json")

CLICK_TEXTS = [
    "Play",
    "PLAY",
    "Start",
    "START",
    "Enter",
    "开始",
    "进入",
    "游玩",
    "Open",
    "Launch",
]


async def capture(context, item: dict) -> dict:
    dest_jpg = COVER_DIR / f"{item['id']}.jpg"
    page = await context.new_page()
    try:
        await page.goto(item["playUrl"], wait_until="domcontentloaded", timeout=28000)
        await page.wait_for_timeout(3500)
        for text in CLICK_TEXTS:
            try:
                loc = page.get_by_text(text, exact=True).first
                if await loc.count():
                    await loc.click(timeout=800)
                    await page.wait_for_timeout(800)
                    break
            except Exception:
                continue
        await page.wait_for_timeout(1800)
        png = COVER_DIR / f"{item['id']}.png"
        await page.screenshot(path=str(png), type="png", animations="disabled")
        subprocess.run(
            ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "78", str(png), "--out", str(dest_jpg)],
            check=True,
            capture_output=True,
        )
        png.unlink(missing_ok=True)
        size = dest_jpg.stat().st_size if dest_jpg.exists() else 0
        ok = dest_jpg.exists() and size > 8000
        return {"id": item["id"], "ok": ok, "bytes": size, "error": None}
    except Exception as e:
        return {"id": item["id"], "ok": False, "bytes": 0, "error": str(e)[:240]}
    finally:
        await page.close()


async def main() -> None:
    COVER_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    sem = asyncio.Semaphore(3)

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            channel="chrome",
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            device_scale_factor=1,
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            ignore_https_errors=True,
        )

        async def bound(item):
            async with sem:
                row = await capture(context, item)
                print(("OK" if row["ok"] else "FAIL"), row["id"], row.get("error") or row["bytes"])
                return row

        results = await asyncio.gather(*(bound(it) for it in ITEMS))
        await browser.close()

    REPORT.write_text(json.dumps(results, indent=2), encoding="utf-8")
    ok = sum(1 for r in results if r["ok"])
    print("done", ok, "/", len(results))


if __name__ == "__main__":
    asyncio.run(main())
