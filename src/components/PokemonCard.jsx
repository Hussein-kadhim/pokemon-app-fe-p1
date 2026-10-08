import { Link } from 'react-router-dom';

function PokemonCard({ name, image, number }) {
  return (
    <div className="pokemon-card">
      <div className="card-image-wrapper">
        <img src={image} alt={name} className="card-image" />
      </div>

      <div className="card-content">
        <div className="card-top-row">
          <h3 className="pokemon-name">{name}</h3>
          {number && <span className="pokemon-number">{number}</span>}
        </div>

        <Link to={'/pokemon/' + name.toLowerCase()} className="card-button">
          Bekijk details
        </Link>
      </div>
    </div>
  );
}

export default PokemonCard;
