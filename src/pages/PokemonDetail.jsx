import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

function PokemonDetail() {
  // Haal de naam/id op uit de URL (bijv. /pokemon/pikachu)
  const { id } = useParams();

  // STATE: gegevens die we bijhouden
  const [pokemon, setPokemon] = useState(null);
  const [laden, setLaden] = useState(true);
  const [teams, setTeams] = useState(
    JSON.parse(localStorage.getItem('pokemon_teams')) || []
  );
  const [gekozenTeam, setGekozenTeam] = useState('');
  const [bericht, setBericht] = useState('');

  // DATA OPHALEN van de API
  useEffect(() => {
    setLaden(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        setLaden(false);
      })
      .catch(() => {
        setPokemon(null);
        setLaden(false);
      });
  }, [id]);

  // Pokémon toevoegen aan een team
  function voegToeAanTeam() {
    if (!gekozenTeam || !pokemon) return;

    const kopie = [...teams];
    const team = kopie.find((t) => t.id === Number(gekozenTeam));

    if (team.leden.length >= 6) {
      setBericht('Dit team heeft al 6 Pokémon!');
      return;
    }

    if (team.leden.some((p) => p.name === pokemon.name)) {
      setBericht('Zit al in dit team!');
      return;
    }

    team.leden.push({ name: pokemon.name, id: pokemon.id });
    setTeams(kopie);
    localStorage.setItem('pokemon_teams', JSON.stringify(kopie));
    setBericht(`Toegevoegd aan ${team.naam}!`);
  }

  // Laadscherm tonen
  if (laden) {
    return (
      <div className="loading-box">
        <i className="fa-solid fa-spinner fa-spin text-3xl mb-2"></i>
        <p>Laden...</p>
      </div>
    );
  }

  // Niet gevonden
  if (!pokemon) {
    return (
      <div className="hero-card">
        <h2>Pokémon niet gevonden</h2>
        <Link to="/lijst" className="btn-primary">Terug naar de lijst</Link>
      </div>
    );
  }

  // Handige variabelen uit de data halen
  const naam = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const nummer = `#${pokemon.id.toString().padStart(3, '0')}`;
  const afbeelding = pokemon.sprites?.other?.['official-artwork']?.front_default;
  const types = pokemon.types.map((t) => t.type.name);
  const vaardigheid = pokemon.abilities[0]?.ability?.name || 'Onbekend';

  // Stats ophalen
  const getStat = (naam) => pokemon.stats.find((s) => s.stat.name === naam)?.base_stat || 0;
  const hp = getStat('hp');
  const aanval = getStat('attack');
  const verdediging = getStat('defense');
  const snelheid = getStat('speed');

  // Vorige / Volgende knop
  const vorigeId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const volgendeId = pokemon.id < 151 ? pokemon.id + 1 : null;

  return (
    <div>
      {/* Navigatie bovenaan */}
      <div className="top-nav">
        <Link to="/lijst" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Terug naar lijst
        </Link>

        <div className="pager">
          {vorigeId ? (
            <Link to={`/pokemon/${vorigeId}`} className="pager-btn">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </Link>
          ) : (
            <span className="pager-btn disabled">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </span>
          )}
          <span>|</span>
          {volgendeId ? (
            <Link to={`/pokemon/${volgendeId}`} className="pager-btn">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </Link>
          ) : (
            <span className="pager-btn disabled">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </span>
          )}
        </div>
      </div>

      {/* Detailkaart */}
      <div className="detail-card">
        {/* Linker kolom: afbeelding + favorieten + team */}
        <div className="visual-col">
          <div className="image-box">
            <img src={afbeelding} alt={naam} />
          </div>

          {/* Nummer en type badges */}
          <div className="badge-row">
            <span className="id-tag">{nummer}</span>
            {types.map((type) => (
              <span key={type} className={`badge type-${type}`}>{type}</span>
            ))}
          </div>

          {/* Hartje favorieten knop */}
          <FavoriteButton name={pokemon.name} />

          {/* Aan team toevoegen (alleen tonen als er teams zijn) */}
          {teams.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs font-bold text-slate-500 mb-1">Aan team toevoegen:</p>
              <div className="flex gap-1.5 mb-1">
                <select
                  value={gekozenTeam}
                  onChange={(e) => { setGekozenTeam(e.target.value); setBericht(''); }}
                  className="p-1.5 border rounded-md text-xs flex-1 bg-white"
                >
                  <option value="">-- Kies team --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.naam} ({t.leden.length}/6)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={voegToeAanTeam}
                  className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
              {bericht && (
                <p className={`text-xs font-bold ${bericht.includes('Toegevoegd') ? 'text-green-600' : 'text-red-600'}`}>
                  {bericht}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rechter kolom: info + stats */}
        <div className="info-col">
          <h1>{naam}</h1>
          <p>Bekijk hier de details en statistieken van {naam}.</p>

          {/* Gegevens */}
          <h2>Gegevens</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="label">Hoogte</span>
              <span className="value">{pokemon.height / 10} m</span>
            </div>
            <div className="spec-item">
              <span className="label">Gewicht</span>
              <span className="value">{pokemon.weight / 10} kg</span>
            </div>
            <div className="spec-item">
              <span className="label">Type</span>
              <span className="value">{types[0]}</span>
            </div>
            <div className="spec-item">
              <span className="label">Vaardigheid</span>
              <span className="value">{vaardigheid}</span>
            </div>
          </div>

          {/* Statistieken balkjes */}
          <h2>Statistieken</h2>
          <div className="stats-list">
            <div className="stat-row">
              <span className="stat-name">HP</span>
              <div className="bar-track"><div className="bar-fill hp" style={{ width: `${Math.min(hp, 100)}%` }}></div></div>
              <span className="stat-num">{hp}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">AANVAL</span>
              <div className="bar-track"><div className="bar-fill attack" style={{ width: `${Math.min(aanval, 100)}%` }}></div></div>
              <span className="stat-num">{aanval}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">VERDEDIGING</span>
              <div className="bar-track"><div className="bar-fill defense" style={{ width: `${Math.min(verdediging, 100)}%` }}></div></div>
              <span className="stat-num">{verdediging}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">SNELHEID</span>
              <div className="bar-track"><div className="bar-fill speed" style={{ width: `${Math.min(snelheid, 100)}%` }}></div></div>
              <span className="stat-num">{snelheid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
