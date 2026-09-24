import { typesIcons } from "../data/typesIcons";
import { typesIconBg } from "../data/typesCardBg";
import { FILTER_TYPES } from "../data/typeApiMap";

export default function TypeFilterBar({ selectedType, onSelectType }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-3">
      <button
        type="button"
        onClick={() => onSelectType("all")}
        className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition  ${
          selectedType === "all"
            ? "bg-[#c53030] text-white shadow-sm"
            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }`}
      >
        <img src="/pokeball.svg" alt="" className="h-4 w-4" />
        Todos
      </button>

      {FILTER_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelectType(type)}
          className={` cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            selectedType === type
              ? "border-[#c53030] bg-red-50 text-[#c53030] ring-1 ring-[#c53030]/30"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full p-1 ${typesIconBg[type] ?? "bg-slate-400"}`}
          >
            <img src={typesIcons[type]} alt="" className="h-3.5 w-3.5" />
          </span>
          {type}
        </button>
      ))}
    </div>
  );
}
