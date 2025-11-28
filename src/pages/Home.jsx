import { useEffect, useState } from 'react'
import PokemonCard from '../components/PokemonCard';

const Home = () => {
  const [allPokemones, setAllPokemones] = useState([]);
  const [pokemonesDetails, setPokemonesDetails] = useState([]);
  const limit = 20



  //Trae todos los pokemones de poke API
  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
      const data = await res.json()
      setAllPokemones(data.results)
    };
    fetchAll();
  }, [])


  //Trae los datos del pokemon
  const fetchPokemonDetails = async (pokemonList) => {

    return await Promise.all(
      pokemonList.map(async (pokemon) => {

        //busco id del pokemon 
        const id = pokemon.url.match(/\/(\d+)\/?$/)[1]; // busca el numero al final de la url

        //busco los tipos del pokemon 
        const typesPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const dataPokemon = await typesPokemon.json()
        const urlTypes = dataPokemon.types.map(i => i.type.url)
        const img = dataPokemon.sprites.other['official-artwork'].front_default;

        //tipos en español
        const typesEs = await Promise.all(
          urlTypes.map(async (url) => {
            const response = await fetch(url)
            const data = await response.json()
            const nameEs = data.names.find(n => n.language.name === "es").name
            return nameEs
          })
        )

        return {
          name: pokemon.name,
          id: id,
          types: typesEs,
          image: img,
        }
      })
    )
  }

  // Cuando ya tengo la lista completa, traigo los primeros 20 detalles
  useEffect(() => {
    if (allPokemones.length > 0) {
      const loadFirstPokemons = async () => {
        const first20 = allPokemones.slice(0, limit);
        const details = await fetchPokemonDetails(first20);
        setPokemonesDetails(details);
      };
      loadFirstPokemons();
    }
  }, [allPokemones]);


  return (
    <>
      <main className=" bg-[url('/z.png')] bg-center flex items-center justify-center">
        <div className="bg-[url('/d.png')] mx-auto mt-0 max-w-7xl  flex flex-col items-center justify-center">

          <section className='bg-[#313131] min-w-full text-white flex flex-col items-center justify-center'>
            <img src="/LogoPoke.png" alt="logo-pokemon" className='w-50 h-50' />
            <div className='flex items-center justify-around w-full mb-10'>
              <div className='flex flex-col'>
                <label htmlFor="text" className='font-noto text-3xl '>Nombre o número</label>
                <input type="text" id='text' className='p-2.5 bg-white' />
                <p>¡Usa la busqueda avanzada para encontrar el Pokemon por su tipo!</p>
              </div>
              <div>
                <p>Busca un Pokémon por su nombre  o usando  su número de la Pokédex</p>
              </div>
            </div>
          </section>

          <section className='bg-gray-400 w-full flex items-center justify-center '>
            <p>Mostrar busqueda avanzado</p>
          </section> 

          <section >
            <div className="flex bg-white flex-wrap  items-center justify-center gap-5">
              {
                pokemonesDetails.map((pokemon, index) => (

                  <PokemonCard
                    key={index}
                    id={pokemon.id}
                    name={pokemon.name}
                    img={pokemon.image}
                    types={pokemon.types} />
                ))

              }
              <button className=' cursor-pointer flex gap-3 bg-red-900 text-white font-noto font-semibold text-sm items-center justify-center py-2 px-4 rounded-lg'>
                <img src="/pokeball.svg" alt="Pokeball" className='w-5 h-5' />
                Cargar más Pokemones
              </button>
            </div>
          </section> 

        </div>
      </main>
    </>
  )
}

export default Home