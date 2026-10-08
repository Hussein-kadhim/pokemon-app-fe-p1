import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <i className="fa-solid fa-circle-dot logo-icon"></i>
          <span className="brand-name">Pokédex</span>
        </Link>

        <nav className="main-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/lijst" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Lijst
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;