export default function AppFooter() {
  return (
    <footer className="mt-auto bg-[#2d3748] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-noto font-semibold">
          <img src="/LogoPokedex.png" alt="" className="h-13  object-contain" />
        </div>
        <p className="text-white/80">© 2026 Federico Sánchez</p>
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-white/90 underline-offset-2 hover:text-white hover:underline"
        >
          API: PokéAPI
          <span aria-hidden>↗</span>
        </a>
      </div>
    </footer>
  );
}
