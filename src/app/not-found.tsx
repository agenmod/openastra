import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-8 py-20">
      <h1 className="display text-4xl">这局不存在</h1>
      <p className="mt-3 text-mute">可能还是草稿，或者链接写错了。</p>
      <Link href="/" className="btn-solid mt-6 inline-block rounded-full px-5 py-3">
        回广场
      </Link>
    </main>
  );
}
