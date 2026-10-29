import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Teams() {
  // 1. STATE gegevens die we bijhouden
  const [teams, setTeams] = useState(
    JSON.parse(localStorage.getItem('pokemon_teams')) || []
  );
  const [teamNaam, setTeamNaam] = useState('');
  const [pokemonLijst, setPokemonLijst] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((res) => res.json())
      .then((data) => setPokemonLijst(data.results));
  }, []);

  // 3. OPSLAAN (steeds als 'teams' verandert, opslaan in localStorage)
  useEffect(() => {
    localStorage.setItem('pokemon_teams', JSON.stringify(teams));
  }, [teams]);

  // Nieuw
  function maakTeam(e) {
    e.preventDefault();
    if (!teamNaam) return;

    const nieuwTeam = {
      id: Date.now(), // uniek nummer
      naam: teamNaam,
      leden: [],
    };

    setTeams([...teams, nieuwTeam]);
    setTeamNaam(''); // invoerveld weer leegmaken
  }

  // verwijderen
  function verwijderTeam(index) {
    const kopie = [...teams];
    kopie.splice(index, 1); // verwijder 1 team
    setTeams(kopie);
  }

  // toevoegen
  function voegPokemonToe(teamIndex, pokemonNaam) {
    if (!pokemonNaam) return;

    const kopie = [...teams];
    const team = kopie[teamIndex];

    // Maximaal 6
    if (team.leden.length >= 6) {
      alert('Een team mag maximaal 6 Pokémon hebben!');
      return;
    }

    // Nummer (ID) afbeelding
    const pokemonId = pokemonLijst.findIndex((p) => p.name === pokemonNaam) + 1;

    team.leden.push({ name: pokemonNaam, id: pokemonId });
    setTeams(kopie);
  }

  // verwijderen
  function verwijderPokemon(teamIndex, pokemonIndex) {
    const kopie = [...teams];
    kopie[teamIndex].leden.splice(pokemonIndex, 1); // verwijder 1 pokémon
    setTeams(kopie);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* BOVENKANT: Team aanmaken */}
      <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Pokémon Teams Beheren</h1>
        <p className="text-slate-500 text-sm mb-4">
          Maak een team aan en kies maximaal 6 Pokémon.
        </p>

        <form onSubmit={maakTeam} className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Naam van je team..."
            value={teamNaam}
            onChange={(e) => setTeamNaam(e.target.value)}
            className="w-72 px-3 py-2 border rounded-md text-sm"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white font-bold px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            + Team Aanmaken
          </button>
        </form>
      </div>

      {/* ONDERKANT: Overzicht van je teams */}
      {teams.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-500 text-sm">
          Nog geen teams aangemaakt. Maak hierboven een team aan!
        </div>
      ) : (
        teams.map((team, teamIndex) => (
          <div key={team.id} className="bg-white border rounded-xl p-5 shadow-sm">
            {/* Team titel & verwijder-knop */}
            <div className="flex justify-between items-center pb-3 mb-4 border-b">
              <div>
                <h2 className="text-lg font-bold">{team.naam}</h2>
                <span className="text-xs text-slate-500">
                  {team.leden.length} / 6 Pokémon
                </span>
              </div>
              <button
                type="button"
                onClick={() => verwijderTeam(teamIndex)}
                className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold cursor-pointer"
              >
                Team Verwijderen
              </button>
            </div>

            {/* Dropdown om Pokémon te kiezen */}
            <div className="mb-4">
              <select
                defaultValue=""
                onChange={(e) => {
                  voegPokemonToe(teamIndex, e.target.value);
                  e.target.value = ''; // dropdown weer resetten
                }}
                className="px-3 py-2 border rounded-md text-sm bg-white w-full max-w-xs cursor-pointer"
              >
                <option value="">+ Kies een Pokémon...</option>
                {pokemonLijst.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Lijst van Pokémon in dit specifieke team */}
            {team.leden.length === 0 ? (
              <p className="text-slate-400 italic text-sm">
                Kies hierboven een Pokémon voor dit team.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {team.leden.map((pokemon, pokemonIndex) => (
                  <div
                    key={pokemonIndex}
                    className="bg-slate-50 border rounded-lg p-2.5 text-center relative"
                  >
                    {/* Kruisje om Pokémon te verwijderen */}
                    <button
                      type="button"
                      onClick={() => verwijderPokemon(teamIndex, pokemonIndex)}
                      className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>

                    {/* Plaatje van de Pokémon */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                      alt={pokemon.name}
                      className="h-16 mx-auto mb-1 object-contain"
                    />

                    <div className="font-bold text-xs capitalize truncate">
                      {pokemon.name}
                    </div>

                    <Link
                      to={`/pokemon/${pokemon.name}`}
                      className="text-xs text-blue-600 hover:underline block mt-1"
                    >
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Teams;
