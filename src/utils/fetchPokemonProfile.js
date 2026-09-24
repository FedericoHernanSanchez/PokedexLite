import { TYPE_EN_TO_ES } from "../data/typeApiMap";

function extractId(url) {
  return url.match(/\/(\d+)\/?$/)[1];
}

function flattenEvolutionChain(node, acc = []) {
  acc.push({
    id: extractId(node.species.url),
    name: node.species.name,
  });
  node.evolves_to.forEach((next) => flattenEvolutionChain(next, acc));
  return acc;
}

async function fetchTypeEs(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.names.find((n) => n.language.name === "es")?.name ?? data.name;
}

async function fetchWeaknesses(types) {
  const relations = await Promise.all(
    types.map(async (t) => {
      const res = await fetch(t.type.url);
      return res.json();
    })
  );

  const multipliers = {};
  for (const rel of relations) {
    for (const t of rel.damage_relations.double_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
    }
    for (const t of rel.damage_relations.half_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
    }
    for (const t of rel.damage_relations.no_damage_from) {
      multipliers[t.name] = 0;
    }
  }

  return Object.entries(multipliers)
    .filter(([, value]) => value > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([name, multiplier]) => ({
      name: TYPE_EN_TO_ES[name] ?? name,
      multiplier,
    }));
}

async function fetchAbilities(abilities) {
  const baseAbilities = abilities.filter((entry) => !entry.is_hidden);

  return Promise.all(
    baseAbilities.map(async (entry) => {
      const res = await fetch(entry.ability.url);
      const data = await res.json();
      const nameEs =
        data.names.find((n) => n.language.name === "es")?.name ?? data.name;
      const flavor =
        data.flavor_text_entries.find((f) => f.language.name === "es") ??
        data.flavor_text_entries.find((f) => f.language.name === "en");
      const effect =
        data.effect_entries.find((e) => e.language.name === "es") ??
        data.effect_entries.find((e) => e.language.name === "en");

      return {
        name: nameEs,
        hidden: entry.is_hidden,
        description: (flavor?.flavor_text ?? effect?.short_effect ?? "Sin descripción.")
          .replace(/\s+/g, " ")
          .trim(),
      };
    })
  );
}

async function fetchEvolutionMember(id) {
  const [speciesRes, pokemonRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
  ]);
  const species = await speciesRes.json();
  const pokemon = await pokemonRes.json();

  const types = await Promise.all(
    pokemon.types.map((t) => fetchTypeEs(t.type.url))
  );

  return {
    id: String(pokemon.id),
    name: species.names.find((n) => n.language.name === "es")?.name ?? pokemon.name,
    types,
    image: pokemon.sprites.other["official-artwork"].front_default,
  };
}

export async function fetchPokemonProfile(id) {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  if (!pokemonRes.ok || !speciesRes.ok) {
    throw new Error("No se pudo cargar el Pokémon");
  }

  const pokemon = await pokemonRes.json();
  const species = await speciesRes.json();

  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();
  const chainMembers = flattenEvolutionChain(chainData.chain);

  const [weaknesses, abilities, evolutions] = await Promise.all([
    fetchWeaknesses(pokemon.types),
    fetchAbilities(pokemon.abilities),
    Promise.all(chainMembers.map((m) => fetchEvolutionMember(m.id))),
  ]);

  return {
    id: pokemon.id,
    name: species.names.find((n) => n.language.name === "es")?.name ?? pokemon.name,
    types: pokemon.types.map((t) => TYPE_EN_TO_ES[t.type.name] ?? t.type.name),
    image: pokemon.sprites.other["official-artwork"].front_default,
    stats: pokemon.stats,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    category:
      species.genera.find((g) => g.language.name === "es")?.genus ??
      species.genera.find((g) => g.language.name === "en")?.genus ??
      "—",
    weaknesses,
    abilities,
    evolutions,
  };
}
