import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import modeContext from '../../context/ModeContext';
import './navbar.css';

const Navbar = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const mode_context = useContext(modeContext);
    const { darkMode, toggleDarkMode } = mode_context;
    
    
    const navigate = useNavigate();

    const getUserDetails = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:8181/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        setName(json.name);
        setRole(json.role);
    }

    useEffect(() => {
        getUserDetails();
        document.body.style.transition = "all 0.2s"
    }, [])
    

    const logout = () => {
        localStorage.removeItem('auth-token');
        navigate('/login');
    }

    const capitalizeFirstCh = (s) => {
        let c = role.toUpperCase();
        // s[0] = role[0];
        return c[0] + role.substring(1, role.length).toLowerCase();
    }

  return (
    <>
    <nav className={`navbar navbar-expand-lg bg-${darkMode?'dark':'light'} ${darkMode && 'navbar-dark'}`}>
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Quiz Portal</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to={'/'}>Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to={'/leaderboard'}>Leaderboard</Link>
                </li>
                {role === "teacher" && <li className="nav-item">
                    <Link className="nav-link" to={'/createquiz'}>Create A New Quiz</Link>
                </li>}
                {role === "teacher" && <li className="nav-item">
                    <Link className="nav-link" to={'/yourquizes'}>Your Quizes</Link>
                </li>}
                {role === "admin" && <li className="nav-item">
                    <Link className="nav-link" to={'/pendingapprovals'}>Pending Approvals</Link>
                </li>}
                {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </a>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
                </li> */}
                <li className="nav-item">
                {/* <a className="nav-link disabled">Disabled</a> */}
                </li>
            </ul>
            <div className="form-check form-switch">
                <label style={{ color: darkMode && '#ffffffb3' }} className="form-check-label dark-mode-text" for="flexSwitchCheckDefault">Dark Mode</label>
                <input onClick={toggleDarkMode} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
            </div>
                <div style={{ color: darkMode && 'white' }} className='greeting'>
                    <p className='greeting-p'>Hi, <strong>{name}</strong></p>
                    <span className='greeting-span'>{capitalizeFirstCh(role)}</span>
                </div>
                <button onClick={logout} className="btn btn-outline-success" type="submit">Logout</button>
            </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar