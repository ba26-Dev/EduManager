import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../src/components/Home';

function App() {
  return (
    <Router>
      <Routes path='/' element ={<Home/>} />
        <Routes>
      </Routes>
    </Router>
  )
}

export default App
