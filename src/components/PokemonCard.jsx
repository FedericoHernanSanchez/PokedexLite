import React from "react";
import { typesIcons } from "../data/typesIcons";
import { typesBadgeLight, typesCardBg } from "../data/typesCardBg";
import { Link } from "react-router-dom";

function StatIcon({ kind }) {
  if (kind === "hp") {
    return (
      <svg className="h-3.5 w-3.5 text-[#e53e3e]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  if (kind === "attack") {
    return (
      <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 text-[#3182ce]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 11.99h7c-.53 4.12-3.28 7.79-7 8.94V14H5V6.3l7-2.11v9.8z" />
    </svg>
  );
}

const PokemonCard = React.memo(function PokemonCard({
  id,
  name,
  img,
  types,
  hp,
  attack,
  defense,
}) {
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const primaryType = types[0];
  const cardBg = typesCardBg[primaryType] ?? "bg-slate-100";

  return (
    <Link
      to={`/pokemon/${id}`}
      className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c53030] focus-visible:ring-offset-2"
    >
      <article
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}
      >
        <div className="relative flex min-h-[180px] items-center justify-center p-4 pt-8">
          <span className="absolute left-3 top-3 text-xs font-semibold text-slate-500 bg-white/60 p-1.5 rounded-lg shadow">
            #{String(id).padStart(3, "0")}
          </span>
          <img
            src={img}
            alt={displayName}
            loading="lazy"
            className="h-40 w-auto max-w-full object-contain drop-shadow-sm"
          />
        </div>

        <div className="flex flex-1 flex-col items-center px-4 pb-4 text-center">
          <p className="font-noto text-lg font-bold text-slate-800">
            {displayName}
          </p>

          <div className="mt-2 flex flex-nowrap items-center justify-center gap-1.5">
            {types.map((type, index) => (
              <span
                key={index}
                className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${typesBadgeLight[type] ?? "bg-slate-500 text-white"}`}
              >
                <img src={typesIcons[type]} alt="" className="h-3.5 w-3.5" />
                {type}
              </span>
            ))}
          </div>

          <div className="mt-auto flex w-full items-center justify-evenly  pt-3 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1">
              <StatIcon kind="hp" />
              {hp}
            </span>
            <span className="inline-flex items-center gap-1">
              <StatIcon kind="attack" />
              {attack}
            </span>
            <span className="inline-flex items-center gap-1">
              <StatIcon kind="defense" />
              {defense}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default PokemonCard;
