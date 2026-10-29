import { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';

function Lijst() {
  const [pokemonLijst, setPokemonLijst] = useState([]);
  const [laden, setLaden] = useState(true);
  const [zoekopdracht, setZoekopdracht] = useState('');

  useEffect(() => {
    async function haalPokemonLijstOp() {
      setLaden(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setPokemonLijst(data.results || []);
      } catch (fout) {
        console.error('Fout bij ophalen van Pokémon:', fout);
      } finally {
        setLaden(false);
      }
    }

    haalPokemonLijstOp();
  }, []);

  const gefilterdePokemon = pokemonLijst.filter((pokemon, index) => {
    const nummer = String(index + 1);
    const zoek = zoekopdracht.toLowerCase().trim();
    return pokemon.name.toLowerCase().includes(zoek) || nummer.includes(zoek);
  });

  return (
    <div>
      <div className="hero-card" style={{ maxWidth: '100%', marginBottom: '24px' }}>
        <h1 className="hero-title">Kanto Pokédex Lijst</h1>
        <p className="hero-subtitle">Bekijk alle 151 originele Pokémon uit de Kanto regio</p>

        <form onSubmit={(e) => e.preventDefault()} className="search-form">
          <input
            type="text"
            placeholder="Filter op naam of nummer..."
            value={zoekopdracht}
            onChange={(e) => setZoekopdracht(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      {laden ? (
        <div className="loading-box">
          <i className="fa-solid fa-spinner fa-spin text-3xl mb-2"></i>
          <p>Pokémon laden...</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {gefilterdePokemon.map((pokemon) => {
            const urlDelen = pokemon.url.split('/').filter(Boolean);
            const id = urlDelen[urlDelen.length - 1];
            const afbeelding = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            return (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                image={afbeelding}
                number={`#${String(id).padStart(3, '0')}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Lijst;
