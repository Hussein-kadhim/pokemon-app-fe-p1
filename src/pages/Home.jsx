import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase().replace('#', '');
    if (query) {
      navigate(`/pokemon/${query}`);
    } else {
      navigate('/lijst');
    }
  };

  const starterPokemon = [
    {
      id: 1,
      number: '#001',
      name: 'Bulbasaur',
      type: 'Gras',
      typeClass: 'type-grass',
      slug: 'bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    },
    {
      id: 4,
      number: '#004',
      name: 'Charmander',
      type: 'Vuur',
      typeClass: 'type-fire',
      slug: 'charmander',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    },
    {
      id: 7,
      number: '#007',
      name: 'Squirtle',
      type: 'Water',
      typeClass: 'type-water',
      slug: 'squirtle',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero card section */}
      <section className="hero-section">
        <div className="hero-card">
          <h1 className="hero-title">Kanto Pokédex</h1>
          <p className="hero-subtitle">
            Een overzichtelijke gids voor de originele 151 Pokémon.
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Zoek op naam of nummer (bijv. #001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              <i className="fa-solid fa-magnifying-glass"></i> Zoeken
            </button>
          </form>

          <div className="hero-actions">
            <Link to="/lijst" className="btn-primary">
              Bekijk alle Pokémon
            </Link>
          </div>
        </div>
      </section>

      {/* Starter Pokémon section */}
      <section className="starter-section">
        <div className="section-header">
          <h2 className="section-title">Starter Pokémon</h2>
          <hr className="section-line" />
        </div>

        <div className="starter-grid">
          {starterPokemon.map((poke) => (
            <div key={poke.id} className="pokemon-card starter-card">
              <div className="card-image-wrapper">
                <img
                  src={poke.image}
                  alt={poke.name}
                  className="card-image"
                  loading="lazy"
                />
              </div>

              <div className="card-content">
                <div className="card-top-row">
                  <h3 className="pokemon-name">{poke.name}</h3>
                  <span className="pokemon-number">{poke.number}</span>
                </div>

                <div className="card-badge-row">
                  <span className={`badge ${poke.typeClass}`}>
                    {poke.type}
                  </span>
                </div>

                <Link
                  to={`/pokemon/${poke.slug}`}
                  className="card-button"
                >
                  Bekijk details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
