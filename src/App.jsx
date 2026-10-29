import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lijst from './pages/Lijst';
import Teams from './pages/Teams';
import PokemonDetail from './pages/PokemonDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container flex-1" style={{ marginTop: '24px', marginBottom: '24px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lijst" element={<Lijst />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;