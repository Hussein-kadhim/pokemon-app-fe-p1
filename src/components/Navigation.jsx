import { NavLink } from 'react-router-dom';

function Navigation() {
  const getNavKlasse = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

  return (
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
  );
}

export default Navigation;