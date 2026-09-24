import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import AppFooter from "../components/layout/AppFooter";
import { typesIcons } from "../data/typesIcons";
import { typesBadgeLight, typesCardBg } from "../data/typesCardBg";
import { fetchPokemonProfile } from "../utils/fetchPokemonProfile";

const STAT_LABELS = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

function TypeBadge({ type, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${typesBadgeLight[type] ?? "bg-slate-500 text-white"} ${className}`}
    >
      <img src={typesIcons[type]} alt="" className="h-4 w-4" />
      {type}
    </span>
  );
}

function PokemonDetails() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [navigation, setNavigation] = useState({
    previous: null,
    next: null,
  });

  useEffect(() => {
    let cancelled = false;

    setProfile(null);
    setError("");

    const currentId = Number(id);
    const previousId = currentId === 1 ? 1025 : currentId - 1;
    const nextId = currentId === 1025 ? 1 : currentId + 1;

    const load = async () => {
      try {
        const [data, previousData, nextData] = await Promise.all([
          fetchPokemonProfile(currentId),
          fetchPokemonProfile(previousId),
          fetchPokemonProfile(nextId),
        ]);

        if (!cancelled) {
          setProfile(data);

          setNavigation({
            previous: {
              id: previousData.id,
              name: previousData.name,
            },
            next: {
              id: nextData.id,
              name: nextData.name,
            },
          });

          document.title = `${data.name} | Pokédex Lite`;
        }
      } catch {
        if (!cancelled) {
          setError("No se pudo cargar este Pokémon.");
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <p className="font-noto text-slate-700">{error}</p>
          <Link to="/" className="mt-4 text-sm font-medium text-[#c53030] hover:underline">
            Volver al listado
          </Link>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#c53030]" />
          <p className="mt-4 font-noto text-slate-600">Cargando Pokémon...</p>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <div className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">

          <div className="mb-4 flex items-center justify-between gap-4">
            <Link
              to={`/pokemon/${navigation.previous.id}`}
              className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              <span className="text-base ">
                ←
              </span>

              <span className="capitalize">
                {navigation.previous.name}
              </span>

              <span className="text-xs text-slate-500">
                #{String(navigation.previous.id).padStart(3, "0")}
              </span>
            </Link>

            <Link
              to={`/pokemon/${navigation.next.id}`}
              className="flex items-center  gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >

              <span className="text-xs text-slate-500 flex items-center">
                #{String(navigation.next.id).padStart(3, "0")}
              </span>
              <span className="capitalize">
                {navigation.next.name}
              </span>

              <span className="text-base ">
                →
              </span>
            </Link>
          </div>
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="px-4 py-6 sm:px-5">
              <div className="flex justify-center items-center gap-5">
                <h1 className="mt-1 font-noto text-3xl font-bold capitalize text-slate-800 sm:text-4xl">
                  {profile.name}
                </h1>
                <p className="font-noto  font-semibold text-slate-400 ">
                  #{String(profile.id).padStart(3, "0")}
                </p>
              </div>

              <div className=" flex flex-col gap-5 md:flex-row md:items-center md:gap-7">

                <div className="gap-5 flex flex-col items-center text-center md:w-[46%]">

                  {profile.image && (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="mt-4 h-56 w-auto max-w-full object-contain drop-shadow-lg sm:h-70"
                    />
                  )}
                  <div className="  w-full sm:px-2">
                    <h2 className="text-left font-noto text-lg font-bold text-slate-800">Estadísticas base</h2>
                    <ul className="mt-4 space-y-2.5">
                      {profile.stats.map((s) => {
                        const label = STAT_LABELS[s.stat.name] ?? s.stat.name;
                        const pct = Math.min(100, (s.base_stat / 255) * 100);
                        return (
                          <li key={s.stat.name} className="w-full md:max-w-[300px] ">
                            <div className="mb-1 flex justify-between font-noto text-xs">
                              <span className="font-medium text-slate-600">
                                {label}
                              </span>

                              <span className="font-semibold tabular-nums text-slate-800">
                                {s.base_stat}
                              </span>
                            </div>

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#c53030] to-[#fc8181] transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col px-2 gap-5">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-slate-100 px-5 py-3 ">
                    <InfoItem label="Altura" value={`${profile.height.toFixed(1)} m`} />
                    <InfoItem label="Peso" value={`${profile.weight.toFixed(1)} kg`} />
                    <InfoItem label="Categoría" value={profile.category} />
                    <InfoItem
                      label="Habilidad"
                      value={profile.abilities[0]?.name ?? "—"}
                    />
                  </div>
                  <div className="">
                    <ul className="mt-4 space-y-4">
                      {profile.abilities.map((ability) => (
                        <li key={ability.name} className="rounded-xl bg-slate-100 px-4 py-3">
                          <p className="font-noto text-sm font-bold text-slate-800">
                            {ability.name}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {ability.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    <h2 className="font-noto text-lg font-bold text-slate-800">
                      Tipos
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.types.map((type) => (
                        <TypeBadge
                          key={type}
                          type={type}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="">
                    <h2 className="font-noto text-lg font-bold text-slate-800">
                      Debilidades
                    </h2>

                    {profile.weaknesses.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">
                        No tiene debilidades destacadas.
                      </p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.weaknesses.map((weak) => (
                          <TypeBadge
                            key={weak.name}
                            type={weak.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>


            </div>

            <div className=" px-6 py-8 sm:px-5">
              <h2 className="font-noto text-lg font-bold text-slate-800">Evoluciones</h2>
              {profile.evolutions.length <= 1 ? (
                <p className="mt-3 text-sm text-slate-500">Este Pokémon no evoluciona.</p>
              ) : (
                <div className="mt-5 flex flex-wrap items-stretch justify-center gap-4">
                  {profile.evolutions.map((evo, index) => (
                    <div key={evo.id} className="flex items-stretch gap-4">
                      {index > 0 && (
                        <div className="hidden items-center text-slate-400 sm:flex" aria-hidden>
                          →
                        </div>
                      )}
                      <Link
                        to={`/pokemon/${evo.id}`}
                        className={`w-48 rounded-2xl border p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${String(evo.id) === String(profile.id)
                          ? "border-[#c53030]/40 border-1"
                          : "border-slate-200"
                          } ${typesCardBg[evo.types[0]] ?? "bg-slate-50"}`}
                      >
                        <p className="text-xs font-semibold text-slate-500 bg-white/60 p-1.5 rounded-lg shadow inline-block ">
                          #{String(evo.id).padStart(3, "0")}
                        </p>
                        {evo.image && (
                          <img
                            src={evo.image}
                            alt={evo.name}
                            className="mx-auto my-2 h-24 w-auto object-contain"
                          />
                        )}
                        <p className="font-noto text-sm font-bold text-slate-800">{evo.name}</p>
                        <div className="mt-2 flex flex-nowrap items-center justify-center gap-1">
                          {evo.types.map((type) => (
                            <TypeBadge
                              key={type}
                              type={type}
                              className="shrink-0 px-2 py-0.5 text-[11px] whitespace-nowrap"
                            />
                          ))}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
          <Link
            to="/"
            className=" mt-4 mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-[#c53030]/90 text-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#9b2c2c]"
          >
            ← Ir a la Pokedex
          </Link>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-noto text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default PokemonDetails;
