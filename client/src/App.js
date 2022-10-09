import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Createquiz from './components/CreateQuiz/Createquiz';

function App() {
  return (
      <Router>
        <Routes>
          <Route path = "/login" element = {<Login />}/>
          <Route path = "/register" element = {<Signup />}/>
          <Route path = "/" element = {<Home />}/>
          <Route path = "/createquiz" element = {<Createquiz />}/>
        </Routes>
      </Router>
  );
}

export default App;
