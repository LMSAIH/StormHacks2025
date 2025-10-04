import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Visualization from './pages/Visualization';
import './App.css'

function App() {

    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Visualization" element={<Visualization />} />
        </Routes>
      </Router>
  )
}

export default App
