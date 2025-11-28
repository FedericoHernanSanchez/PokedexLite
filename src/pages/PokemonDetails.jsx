import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PokemonDetail() {
  const { id } = useParams();  // 👈 toma el id de la URL (/pokemon/001)
  const [pokemon, setPokemon] = useState(null);

  // Trae los datos del Pokémon por ID
  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      setPokemon(data);

      // Cambia el título de la pestaña
      document.title = data.name.toUpperCase();
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) return <p>Cargando...</p>;

  return (
    <div className="text-white p-10">
      <h1 className="text-4xl font-bold uppercase">{pokemon.name}</h1>
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="w-72"
      />

      <h2 className="text-xl font-semibold mt-5">Tipos</h2>
      <ul>
        {pokemon.types.map(t => (
          <li key={t.type.name}>{t.type.name}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-5">Stats</h2>
      <ul>
        {pokemon.stats.map(s => (
          <li key={s.stat.name}>
            {s.stat.name}: {s.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonDetail;