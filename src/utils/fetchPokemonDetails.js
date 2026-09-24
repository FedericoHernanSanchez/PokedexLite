export async function fetchPokemonDetails(pokemonList) {
  return Promise.all(
    pokemonList.map(async (pokemon) => {
      const id = pokemon.url.match(/\/(\d+)\/?$/)[1];

      const [speciesRes, pokemonRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      ]);

      const speciesData = await speciesRes.json();
      const dataPokemon = await pokemonRes.json();

      const nameEs = speciesData.names.find((n) => n.language.name === "es").name;
      const urlTypes = dataPokemon.types.map((i) => i.type.url);
      const img = dataPokemon.sprites.other["official-artwork"].front_default;

      const typesEs = await Promise.all(
        urlTypes.map(async (url) => {
          const response = await fetch(url);
          const data = await response.json();
          return data.names.find((n) => n.language.name === "es").name;
        })
      );

      const stat = (name) =>
        dataPokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

      return {
        name: nameEs,
        id,
        types: typesEs,
        image: img,
        hp: stat("hp"),
        attack: stat("attack"),
        defense: stat("defense"),
      };
    })
  );
}
