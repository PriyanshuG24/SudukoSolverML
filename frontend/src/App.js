import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Navabr from './components/Navabr';
import Home from './pages/Home'
import Suduko from './pages/Suduko'
import Footer from './components/Footer';
import Gameplay from './pages/Gameplay'
import Game from './pages/Game';
import Solution from './components/Solution';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/suduko' element={<Suduko/>}/>
        {/* <Route path='/login' element={<Login/>}/> */}
        <Route path='/gameplay' element={<Gameplay/>}/>
        <Route path='/game/:level' element={<Game/>}/>
        <Route path='/solution/:imageId' element={<Solution/>}/>
      </Routes>
      <Navabr/>
      <Footer/>
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
