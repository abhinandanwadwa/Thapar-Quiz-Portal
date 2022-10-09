import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            navigate('/');
        }
        // eslint-disable-next-line
    }, []);
    

    const login = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8181/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ email, password })
        });
        const json = await response.json();
        if (json.authtoken) {
            localStorage.setItem('auth-token', json.authtoken);
            navigate('/');
        }
        else if (json.errors) {
            const allErrors = json.errors;
            allErrors.forEach(error => {
                toast.error(error.msg);
            });
        }
        else {
            toast.error(json.error);
        }
    }
    
  return (
    <div className='container mt-5'>
        <h2 className='mb-4 login-heading'>Login to Your Account</h2>
        <form>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <button onClick={login} type="submit" id='login-button' className="btn btn-primary mt-3">Login</button>
        </form>
        <ToastContainer toastStyle={{ backgroundColor: "#202d40", color: 'white' }} />
    </div>
  )
}

export default Login