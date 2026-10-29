import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

function PokemonCard({ name, image, number, onFavoriteToggle }) {
  return (
    <div className="pokemon-card">
      <div className="card-image-box">
        <FavoriteButton name={name} onToggle={onFavoriteToggle} />
        <img src={image} alt={name} />
      </div>

      <div className="card-title-row">
        <span className="card-name">{name}</span>
        {number && <span className="card-num">{number}</span>}
      </div>

      <Link to={`/pokemon/${name.toLowerCase()}`} className="btn-card">
        Bekijk details
      </Link>
    </div>
  );
}

export default PokemonCard;
