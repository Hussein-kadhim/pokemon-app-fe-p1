import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

function PokemonDetail() {
  const { id } = useParams();
  const pokemonNaam = id || 'pikachu';

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('pokemon_teams');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamMessage, setTeamMessage] = useState('');

  const handleAddToTeam = () => {
    if (!selectedTeamId || !pokemon) return;

    const team = teams.find((t) => t.id === Number(selectedTeamId));
    if (!team) return;

    if (team.leden.length >= 6) {
      setTeamMessage('Dit team heeft al 6 Pokémon!');
      return;
    }

    if (team.leden.some((p) => p.name === pokemon.name)) {
      setTeamMessage('Zit al in dit team!');
      return;
    }

    const updatedTeams = teams.map((t) => {
      if (t.id === Number(selectedTeamId)) {
        return {
          ...t,
          leden: [...t.leden, { name: pokemon.name, id: pokemon.id }],
        };
      }
      return t;
    });

    setTeams(updatedTeams);
    localStorage.setItem('pokemon_teams', JSON.stringify(updatedTeams));
    setTeamMessage(`Toegevoegd aan ${team.naam}!`);
  };

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNaam.toLowerCase()}`);
        if (response.ok) {
          const data = await response.json();
          setPokemon(data);
        } else {
          setPokemon(null);
        }
      } catch (error) {
        console.error('Fout bij ophalen Pokémon:', error);
        setPokemon(null);
      }
      setLoading(false);
    }

    fetchPokemon();
  }, [pokemonNaam]);

  if (loading) {
    return (
      <div className="loading-box">
        <i className="fa-solid fa-spinner fa-spin text-3xl mb-2"></i>
        <p>Laden...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="hero-card">
        <h2>Pokémon niet gevonden</h2>
        <p>We konden &quot;{pokemonNaam}&quot; niet vinden in de database.</p>
        <Link to="/lijst" className="btn-primary">
          Terug naar de lijst
        </Link>
      </div>
    );
  }

  const naam = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const nummer = `#${pokemon.id.toString().padStart(3, '0')}`;
  const afbeelding = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;
  const types = pokemon.types.map((t) => t.type.name);
  const hoofdType = types[0] || 'normal';
  const vaardigheid = pokemon.abilities[0]?.ability?.name || 'Onbekend';

  const getStat = (name) => pokemon.stats.find((s) => s.stat.name === name)?.base_stat || 0;
  const hp = getStat('hp');
  const attack = getStat('attack');
  const defense = getStat('defense');
  const speed = getStat('speed');

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;

  return (
    <div>
      {/* Navigatie bovenaan */}
      <div className="top-nav">
        <Link to="/lijst" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Terug naar Pokédex Lijst
        </Link>

        <div className="pager">
          {prevId ? (
            <Link to={`/pokemon/${prevId}`} className="pager-btn">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </Link>
          ) : (
            <span className="pager-btn disabled">
              <i className="fa-solid fa-chevron-left"></i> Vorige
            </span>
          )}
          <span>|</span>
          {nextId ? (
            <Link to={`/pokemon/${nextId}`} className="pager-btn">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </Link>
          ) : (
            <span className="pager-btn disabled">
              Volgende <i className="fa-solid fa-chevron-right"></i>
            </span>
          )}
        </div>
      </div>

      {/* Detail kaart */}
      <div className="detail-card">
        {/* Linker kolom */}
        <div className="visual-col">
          <div className="image-box">
            <img src={afbeelding} alt={naam} />
          </div>

          <div className="badge-row">
            <span className="id-tag">{nummer}</span>
            {types.map((type) => (
              <span key={type} className={`badge type-${type}`}>
                {type}
              </span>
            ))}
          </div>

          <FavoriteButton name={pokemon.name} />

          {/* Aan team toevoegen */}
          {teams.length > 0 && (
            <div className="mt-3.5 w-full text-center">
              <div className="text-xs font-bold text-slate-500 mb-1.5">
                Aan team toevoegen:
              </div>
              <div className="flex gap-1.5 mb-1.5">
                <select
                  value={selectedTeamId}
                  onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    setTeamMessage('');
                  }}
                  className="p-1.5 rounded-md border border-slate-300 text-xs flex-1 bg-white"
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
                  onClick={handleAddToTeam}
                  className="bg-slate-900 text-white font-bold px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition text-xs cursor-pointer"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              {teamMessage && (
                <div className={`text-xs font-bold ${teamMessage.includes('Toegevoegd') ? 'text-green-600' : 'text-red-600'}`}>
                  {teamMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rechter kolom */}
        <div className="info-col">
          <div>
            <h1>{naam}</h1>
            <p>Bekijk hier de details en statistieken van {naam}.</p>
          </div>

          <div>
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
                <span className="value">{hoofdType}</span>
              </div>
              <div className="spec-item">
                <span className="label">Vaardigheid</span>
                <span className="value">{vaardigheid}</span>
              </div>
            </div>
          </div>

          <div>
            <h2>Statistieken</h2>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-name">HP</span>
                <div className="bar-track">
                  <div className="bar-fill hp" style={{ width: `${Math.min(hp, 100)}%` }}></div>
                </div>
                <span className="stat-num">{hp}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">AANVAL</span>
                <div className="bar-track">
                  <div className="bar-fill attack" style={{ width: `${Math.min(attack, 100)}%` }}></div>
                </div>
                <span className="stat-num">{attack}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">VERDEDIGING</span>
                <div className="bar-track">
                  <div className="bar-fill defense" style={{ width: `${Math.min(defense, 100)}%` }}></div>
                </div>
                <span className="stat-num">{defense}</span>
              </div>

              <div className="stat-row">
                <span className="stat-name">SNELHEID</span>
                <div className="bar-track">
                  <div className="bar-fill speed" style={{ width: `${Math.min(speed, 100)}%` }}></div>
                </div>
                <span className="stat-num">{speed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
