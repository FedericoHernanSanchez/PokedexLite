import { useEffect, useMemo, useState } from "react";
import PokemonCard from "../components/PokemonCard";
import AppHeader from "../components/layout/AppHeader";
import AppFooter from "../components/layout/AppFooter";
import TypeFilterBar from "../components/TypeFilterBar";
import { TYPE_ES_TO_EN } from "../data/typeApiMap";
import { fetchPokemonDetails } from "../utils/fetchPokemonDetails";

const TOTAL_POKEMON = 1025;
const PER_PAGE = 20;
const GRID_CLASS =
  "grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[980px]:grid-cols-3 min-[1280px]:grid-cols-4";

function extractId(url) {
  return url.match(/\/(\d+)\/?$/)[1];
}

function applySearch(ids, allPokemon, searchQuery) {
  if (!searchQuery.trim()) return ids;

  const q = searchQuery.trim().toLowerCase().replace("#", "");
  if (/^\d+$/.test(q)) {
    const num = String(parseInt(q, 10));
    return ids.filter((id) => id === num);
  }

  const matching = new Set(
    allPokemon
      .filter((p) => p.name.toLowerCase().includes(q))
      .map((p) => extractId(p.url))
  );
  return ids.filter((id) => matching.has(id));
}

const Home = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredIds, setFilteredIds] = useState([]);
  const [pokemonesDetails, setPokemonesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("number-asc");

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`);
      const data = await res.json();
      setAllPokemon(data.results);
      setFilteredIds(data.results.map((p) => extractId(p.url)));
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const applyTypeFilter = async () => {
      if (allPokemon.length === 0) return;

      let ids;
      if (selectedType === "all") {
        ids = allPokemon.map((p) => extractId(p.url));
      } else {
        const typeEn = TYPE_ES_TO_EN[selectedType];
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeEn}`);
        const data = await res.json();
        ids = data.pokemon
          .map((p) => extractId(p.pokemon.url))
          .filter((id) => Number(id) >= 1 && Number(id) <= TOTAL_POKEMON);
      }

      setFilteredIds(applySearch(ids, allPokemon, searchQuery));
      setPage(1);
    };

    applyTypeFilter();
  }, [allPokemon, selectedType, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const totalPages = Math.max(1, Math.ceil(filteredIds.length / PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    const loadPage = async () => {
      if (filteredIds.length === 0) {
        setPokemonesDetails([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const start = (page - 1) * PER_PAGE;
      const pageIds = filteredIds.slice(start, start + PER_PAGE);
      const list = pageIds.map((id) => ({
        url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      }));
      const details = await fetchPokemonDetails(list);
      setPokemonesDetails(details);
      setLoading(false);
    };

    loadPage();
  }, [filteredIds, page]);

  const sortedDetails = useMemo(() => {
    const copy = [...pokemonesDetails];
    if (sortBy === "name-asc") {
      copy.sort((a, b) => a.name.localeCompare(b.name, "es"));
    } else {
      copy.sort((a, b) => Number(a.id) - Number(b.id));
    }
    return copy;
  }, [pokemonesDetails, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <div className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md shadow-slate-900/5 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <img
                  src="/search.svg"
                  alt=""
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50"
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por nombre o #001..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-[#c53030]/50 focus:outline-none focus:ring-2 focus:ring-[#c53030]/20"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#c53030] px-8 py-3 font-noto text-sm font-semibold text-white shadow-sm transition hover:bg-[#9b2c2c]"
              >
                Buscar
              </button>
            </form>
            <p className="mt-2 text-center text-xs text-slate-500 sm:text-left">
              Busca cualquier Pokémon por nombre o número. Ejemplos: pikachu, charizard, 25
            </p>

            <TypeFilterBar selectedType={selectedType} onSelectType={setSelectedType} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md shadow-slate-900/5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 font-noto text-sm font-medium text-slate-600">
                Mostrando {filteredIds.length} Pokémon
                <img src="/pokeball.svg" alt="" className="h-5 w-5" />
              </p>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                Ordenar por:
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700  focus:outline-none"
                >
                  <option value="number-asc">Número (asc)</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                </select>
              </label>
            </div>

            {loading || allPokemon.length === 0 ? (
              <div className={GRID_CLASS}>
                {Array.from({ length: PER_PAGE }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-slate-100 p-4">
                    <div className="mx-auto h-40 w-40 rounded-full bg-slate-200" />
                    <div className="mt-3 h-4 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : sortedDetails.length === 0 ? (
              <p className="py-12 text-center text-slate-500">No se encontraron Pokémon.</p>
            ) : (
              <div className={GRID_CLASS}>
                {sortedDetails.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    img={pokemon.image}
                    types={pokemon.types}
                    hp={pokemon.hp}
                    attack={pokemon.attack}
                    defense={pokemon.defense}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="mt-8 flex flex-wrap items-center justify-center gap-2"
                aria-label="Paginación"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  ‹
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPage(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 && <span className="text-slate-400">…</span>}
                  </>
                )}

                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                      page === n
                        ? "bg-[#c53030] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <span className="text-slate-400 ">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className={`cursor-pointer flex h-9 min-w-9 items-center justify-center rounded-full px-1 text-sm font-semibold ${
                        page === totalPages
                          ? "bg-[#c53030] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default Home;
