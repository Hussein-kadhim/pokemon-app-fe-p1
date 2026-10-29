import { Link, NavLink } from 'react-router-dom';

function Header() {
  const getNavKlasse = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="site-header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="brand">
          <i className="fa-solid fa-circle-dot"></i>
          <span>Pokédex</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/" className={getNavKlasse} end>
            Home
          </NavLink>
          <NavLink to="/lijst" className={getNavKlasse}>
            Lijst
          </NavLink>
          <NavLink to="/teams" className={getNavKlasse}>
            Teams
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;