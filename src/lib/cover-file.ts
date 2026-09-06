import { mkdir, writeFile } from "fs/promises";
import path from "path";

const DATA_URL = /^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=\s]+)$/i;

export async function saveCoverFromDataUrl(gameId: string, dataUrl: string) {
  const match = DATA_URL.exec(dataUrl.trim());
  if (!match) {
    throw new Error("封面格式不对");
  }

  const ext = match[1].toLowerCase() === "png" ? "png" : "jpg";
  const buffer = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (buffer.length < 800 || buffer.length > 1_800_000) {
    throw new Error("封面大小不对");
  }

  const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const png = buffer[0] === 0x89 && buffer[1] === 0x50;
  if (!jpeg && !png) {
    throw new Error("封面不是图片");
  }

  const dir = path.join(process.cwd(), "public", "covers");
  await mkdir(dir, { recursive: true });
  const file = `${gameId}.${ext}`;
  await writeFile(path.join(dir, file), buffer);
  return `/covers/${file}`;
}
