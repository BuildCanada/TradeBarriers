export default function NavButton() {
  return (
    <div className="mb-6">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.prod.website-files.com/679d23fc682f2bf860558c9a/679d23fc682f2bf860558cc6_build_canada-wordmark.svg"
          alt="Build Canada"
          className="bg-[#932f2f] h-12 w-auto p-3"
        />
      </a>
    </div>
  );
}
