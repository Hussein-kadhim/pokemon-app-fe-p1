import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PokemonDetail() {
  // Haal de id of naam uit de URL
  const { id } = useParams();
  const pokemonNaam = id || 'pikachu';

  // State voor data en laden
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  // Haal de gegevens op van de PokeAPI
  useEffect(() => {
    setLoading(true);

    fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonNaam.toLowerCase())
      .then((antwoord) => antwoord.json())
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((fout) => {
        console.log('Er ging iets mis:', fout);
        setPokemon(null);
        setLoading(false);
      });
  }, [pokemonNaam]);

  // Als de pagina nog aan het laden is
  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Gegevens laden...</p>
        </div>
      </div>
    );
  }

  // Als de Pokemon niet bestaat
  if (!pokemon) {
    return (
      <div className="detail-page">
        <div className="error-card">
          <h2>Pokémon niet gevonden</h2>
          <p>We konden &quot;{pokemonNaam}&quot; niet vinden in de Pokédex database.</p>
          <Link to="/lijst" className="btn-primary">
            Terug naar Pokédex Lijst
          </Link>
        </div>
      </div>
    );
  }

  // Variabelen voor de gegevens
  const nummer = '#' + String(pokemon.id).padStart(3, '0');
  const type = pokemon.types[0]?.type?.name || 'normal';
  const allTypes = pokemon.types.map((t) => t.type.name);
  const afbeelding =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;
  const vaardigheid = pokemon.abilities[0]?.ability?.name || 'Onbekend';

  // Statistieken
  const getStat = (name) => {
    const s = pokemon.stats.find((item) => item.stat.name === name);
    return s ? s.base_stat : 50;
  };

  const hp = getStat('hp');
  const aanval = getStat('attack');
  const verdediging = getStat('defense');
  const snelheid = getStat('speed');

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;

  return (
    <div className="detail-page">
      {/* Navigatie balk bovenaan */}
      <div className="detail-top-nav">
        <Link to="/lijst" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Terug naar Pokédex Lijst
        </Link>

        <div className="pager-links">
          {prevId ? (
            <Link to={'/pokemon/' + prevId} className="pager-btn">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </Link>
          ) : (
            <span className="pager-btn disabled">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </span>
          )}
          <span className="pager-divider">|</span>
          {nextId ? (
            <Link to={'/pokemon/' + nextId} className="pager-btn">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </Link>
          ) : (
            <span className="pager-btn disabled">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </span>
          )}
        </div>
      </div>

      {/* Detail Hoofdkaart */}
      <div className="detail-card">
        {/* Linker kolom: Afbeelding en types */}
        <div className="detail-visual-col">
          <div className="detail-image-box">
            <img src={afbeelding} alt={pokemon.name} className="detail-pokemon-img" />
          </div>

          <div className="detail-badge-group">
            <span className="detail-id-tag">{nummer}</span>
            {allTypes.map((t) => (
              <span key={t} className={`badge type-${t}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Rechter kolom: Informatie en stats */}
        <div className="detail-info-col">
          <div className="detail-header-block">
            <h1 className="detail-title">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>
            <p className="detail-description">
              Dit is {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}. Deze Pokémon slaat energie op en kan sterke aanvallen uitvoeren in gevechten.
            </p>
          </div>

          <div className="detail-section">
            <h2 className="detail-subtitle">Gegevens</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Hoogte</span>
                <span className="spec-value">{pokemon.height / 10} m</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Gewicht</span>
                <span className="spec-value">{pokemon.weight / 10} kg</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Type</span>
                <span className="spec-value">{type}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Vaardigheid</span>
                <span className="spec-value">{vaardigheid}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="detail-subtitle">Statistieken</h2>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-name">HP</span>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill stat-hp"
                    style={{ width: `${Math.min(100, (hp / 180) * 100)}%` }}
                  ></div>
                </div>
                <span className="stat-number">{hp}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">AANVAL</span>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill stat-attack"
                    style={{ width: `${Math.min(100, (aanval / 180) * 100)}%` }}
                  ></div>
                </div>
                <span className="stat-number">{aanval}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">VERDEDIGING</span>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill stat-defense"
                    style={{ width: `${Math.min(100, (verdediging / 180) * 100)}%` }}
                  ></div>
                </div>
                <span className="stat-number">{verdediging}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">SNELHEID</span>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill stat-speed"
                    style={{ width: `${Math.min(100, (snelheid / 180) * 100)}%` }}
                  ></div>
                </div>
                <span className="stat-number">{snelheid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
