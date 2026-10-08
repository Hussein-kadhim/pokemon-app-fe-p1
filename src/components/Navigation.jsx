import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
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
  );
}

export default Navigation;