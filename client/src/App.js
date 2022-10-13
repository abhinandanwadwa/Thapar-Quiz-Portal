import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Createquiz from './components/CreateQuiz/Createquiz';
import Approvequiz from './components/ApproveQuiz/Approvequiz';
import ModeState from './context/ModeState';

function App() {
  return (
      <ModeState>
        <Router>
          <Routes>
            <Route path = "/login" element = {<Login />}/>
            <Route path = "/register" element = {<Signup />}/>
            <Route path = "/" element = {<Home />}/>
            <Route path = "/createquiz" element = {<Createquiz />}/>
            <Route path = "/approve/:id" element = {<Approvequiz />}/>
          </Routes>
        </Router>
      </ModeState>
  );
}

export default App;
