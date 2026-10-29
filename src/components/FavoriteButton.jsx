import { useState, useEffect } from 'react';

function FavoriteButton({ name, onToggle }) {
  const [isFav, setIsFav] = useState(false);

  // Kijken of hij al favoriet is
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('favorieten')) || [];
    setIsFav(list.includes(name?.toLowerCase()));
  }, [name]);

  // Toggle aan/uit en opslaan voor de homepagina
  function toggle(e) {
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem('favorieten')) || [];
    const pokemon = name.toLowerCase();

    // Als hij erin zit weghalen, anders toevoegen
    const updated = isFav 
      ? list.filter((p) => p !== pokemon) 
      : [...list, pokemon];

    localStorage.setItem('favorieten', JSON.stringify(updated));
    setIsFav(!isFav);

    if (onToggle) onToggle(name, !isFav);
  }

  return (
    <button type="button" onClick={toggle} className={isFav ? 'heart-btn active' : 'heart-btn'}>
      <i className={isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
    </button>
  );
}

export default FavoriteButton;
