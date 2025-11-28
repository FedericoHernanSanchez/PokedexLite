import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import './index.css';
import './App.css'

import PokemonDetails from './components/PokemonDetails';

function App() {

  return (
    <Routes>

      <Route path='/' element={<Home/>}/>

      <Route path='/pokemon/:id' element={<PokemonDetails/>}/>

    </Routes>
  )
}

export default App
