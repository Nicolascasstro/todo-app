import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Add from './pages/Add'
import Stats from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App