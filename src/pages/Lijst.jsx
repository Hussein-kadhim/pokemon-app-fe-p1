import { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';

function Lijst() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pokemons:', error);
        setLoading(false);
      });
  }, []);

  const filteredPokemons = pokemons.filter((p, index) => {
    const idStr = String(index + 1);
    const search = searchFilter.toLowerCase().trim();
    return p.name.toLowerCase().includes(search) || idStr.includes(search);
  });

  return (
    <div className="list-page">
      <div className="page-header">
        <h1 className="page-title">Kanto Pokédex Lijst</h1>
        <p className="page-subtitle">Bekijk alle 151 originele Pokémon uit de Kanto regio</p>

        <div className="filter-wrapper">
          <input
            type="text"
            placeholder="Filter op naam of nummer..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Pokémon gegevens laden...</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemons.map((p) => {
            const id = p.url.split('/')[6];
            const afbeelding =
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
              id +
              '.png';

            return (
              <PokemonCard
                key={p.name}
                name={p.name}
                image={afbeelding}
                number={'#' + id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Lijst;
