import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

function Home() {
  const [zoekterm, setZoekterm] = useState('');
  const [favorieten, setFavorieten] = useState([]);
  const [allePokemon, setAllePokemon] = useState([]);
  const navigate = useNavigate();

  // 1. Favorieten ophalen uit localStorage
  useEffect(() => {
    const opslag = localStorage.getItem('favorieten');
    if (opslag) {
      setFavorieten(JSON.parse(opslag));
    }
  }, []);

  // 2. Alle 151 Pokémon ophalen van de API
  useEffect(() => {
    async function haalPokemonOp() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setAllePokemon(data.results || []);
      } catch (fout) {
        console.error('Fout bij ophalen Pokémon:', fout);
      }
    }

    haalPokemonOp();
  }, []);

  // Zoeken via de zoekbalk
  const handleZoeken = (e) => {
    e.preventDefault();
    const schoon = zoekterm.trim().toLowerCase().replace('#', '');
    if (schoon) {
      navigate(`/pokemon/${schoon}`);
    } else {
      navigate('/lijst');
    }
  };

  // Favorieten filteren uit de complete lijst
  const favorietePokemon = allePokemon.filter((p) =>
    favorieten.includes(p.name.toLowerCase())
  );

  // Als een Pokémon ont-favoriet geklikt wordt
  const handleFavoriteToggle = (naam, isNuFavoriet) => {
    if (!isNuFavoriet) {
      setFavorieten((vorige) => vorige.filter((item) => item !== naam.toLowerCase()));
    }
  };

  return (
    <div>
      <section className="hero-card">
        <h1 className="hero-title">Kanto Pokédex</h1>
        <p className="hero-subtitle">
          Een overzichtelijke gids voor de originele 151 Pokémon.
        </p>

        <form onSubmit={handleZoeken} className="search-form">
          <input
            type="text"
            placeholder="Zoek op naam of nummer (bijv. #001)..."
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            <i className="fa-solid fa-magnifying-glass"></i> Zoeken
          </button>
        </form>

        <Link to="/lijst" className="btn-primary">
          Bekijk alle Pokémon
        </Link>
      </section>

      <section>
        <h2 className="section-title">
          <i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i> Mijn Favoriete Pokémon
        </h2>
        <hr className="section-line" />

        {favorietePokemon.length === 0 ? (
          <div className="hero-card" style={{ maxWidth: '100%' }}>
            <p className="hero-subtitle" style={{ marginBottom: 0 }}>
              Je hebt nog geen favoriete Pokémon. Klik op het hartje bij een Pokémon om deze toe te voegen!
            </p>
          </div>
        ) : (
          <div className="pokemon-grid">
            {favorietePokemon.map((pokemon) => {
              const urlDelen = pokemon.url.split('/').filter(Boolean);
              const id = urlDelen[urlDelen.length - 1];
              const afbeelding = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

              return (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  image={afbeelding}
                  number={`#${String(id).padStart(3, '0')}`}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
