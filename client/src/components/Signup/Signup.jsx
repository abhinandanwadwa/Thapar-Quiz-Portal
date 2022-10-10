import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [institute, setInstitute] = useState("");
    // const instcodesToinstnames = {  // To map institute Codes with institute Names
    //     "tiet": "Thapar Institute of Engineering and Technology (TIET)",
    //     "vit": "Vellore Institute of Technology (VIT)",
    //     "iitbombay": "Indian Institute of Technology Bombay (IITB)",
    //     "iitdelhi": "Indian Institute of Technology Delhi (IITD)",
    //     "iitkanpur": "Indian Institute of Technology Kanpur (IITK)",
    //     "iitkharagpur": "Indian Institute of Technology Kharagpur (IITKGP)",
    //     "iitroorkee": "Indian Institute of Technology Roorkee (IITR)"
    // }
    // const [institutes, setInstitutes] = useState(["tiet", "vit", "iitbombay", "iitdelhi", "iitkanpur", "iitkharagpur", "iitroorkee"]);

    const [institutes, setInstitutes] = useState([
        {
            iCode: "tiet",
            iName: "Thapar Institute of Engineering and Technology (TIET)"
        },
        {
            iCode: "vit",
            iName: "Vellore Institute of Technology (VIT)"
        },
        {
            iCode: "iitbombay",
            iName: "Indian Institute of Technology Bombay (IITB)"
        },
        {
            iCode: "iitdelhi",
            iName: "Indian Institute of Technology Delhi (IITD)"
        },
        {
            iCode: "iitkanpur",
            iName: "Indian Institute of Technology Kanpur (IITK)"
        },
        {
            iCode: "iitkharagpur",
            iName: "Indian Institute of Technology Kharagpur (IITKGP)"
        },
        {
            iCode: "iitroorkee",
            iName: "Indian Institute of Technology Roorkee (IITR)"
        },
    ]);



    // <option value="tiet">Thapar Institute of Engineering and Technology (TIET)</option>
    // <option value="vit">Vellore Institute of Technology (VIT)</option>
    // <option value="iitbombay">Indian Institute of Technology Bombay (IITB)</option>
    // <option value="iitdelhi">Indian Institute of Technology Delhi (IITD)</option>
    // <option value="iitkanpur">Indian Institute of Technology Kanpur (IITK)</option>
    // <option value="iitkharagpur">Indian Institute of Technology Kharagpur (IITKGP)</option>
    // <option value="iitroorkee">Indian Institute of Technology Roorkee (IITR)</option>

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            navigate('/');
        }
        // eslint-disable-next-line
    }, []);

    const register = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8181/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ email, password, role, name, institute })
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
    <>
    <div className='container mt-5'>
        <h2 className='mb-4 login-heading'>Login to Your Account</h2>
        <form>
            <div className="my-2">
                <label className="form-label">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="my-2">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="my-2">
                <label className="form-label">Role</label>
                <select defaultValue={'0'} value={role} onChange={(e) => setRole(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value="0">Select Your Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="my-2">
                <label className="form-label">Institute</label>
                <select value={institute} onChange={(e) => setInstitute(e.target.value)} defaultValue={'0'} className="form-select" aria-label="Default select example">
                    <option value="0">Select Your Institute</option>
                    {institutes.map((inst) => {
                        return(
                            <option key={inst.iCode} value={inst.iCode}>{inst.iName}</option>
                        );
                    })}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <button onClick={register} type="submit" id='login-button' className="btn btn-primary mt-3">Login</button>
        </form>
        <p>Already have an account? <Link to={'/login'}>Login Here</Link></p>
        <ToastContainer toastStyle={{ backgroundColor: "#202d40", color: 'white' }} />
    </div>
    </>
  )
}

export default Signup