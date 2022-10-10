import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import { useParams } from 'react-router-dom';
import './approvequiz.css'
import { toast, ToastContainer } from 'react-toastify';

const Approvequiz = () => {
    const [role, setRole] = useState("");
    const [easyQuestions, setEasyQuestions] = useState([]);
    const [mediumQuestions, setMediumQuestions] = useState([]);
    const [hardQuestions, setHardQuestions] = useState([]);
    // const [easyQuestionCount, setEasyQuestionCount] = useState(0);
    // const [mediumQuestionCount, setMediumQuestionCount] = useState(0);
    // const [hardQuestionCount, setHardQuestionCount] = useState(0);

    const { id } = useParams();

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
        if (json.role !== "admin") {
            navigate('/');
        }
        setRole(json.role);
    }


    const getQuizDetails = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch(`http://localhost:8181/api/test/getquiz/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        console.log(json);
        setEasyQuestions(json.easyQuestions);
        setMediumQuestions(json.mediumQuestions);
        setHardQuestions(json.hardQuestions);
    }

    useEffect(() => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        }
        getUserDetails();
        getQuizDetails();
    }, []);



    const approveQuiz = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch(`http://localhost:8181/api/test/approvequiz/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        console.log(json);
    }

    
    const rejectQuiz = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch(`http://localhost:8181/api/test/rejectquiz/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        if (json.success) {
            toast.success("Your response has been sent to the quiz owner successfully!");
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
        else {
            toast.error("Internal Server Error");
        }
    }
    
    

  return (
    <>
    <Navbar />
    <div className="container mt-4">
        <div className="top-container quiz-review-container">
            <span className='top-span-left'>Created By: Prashant Singh Rana</span>
            <h2 className='top-h2'>UCS990</h2>
            <span className='top-span-right'>Total Marks: 30</span>
        </div>
        <hr />
        <div className="container questions-section my-3">
            <div className="easy-questions">
                <h1>Easy Questions</h1>
                {easyQuestions.length !== 0 ? <div className="accordion" id="accordionExample">
                    {easyQuestions.map((question, index) => {
                        return (
                            <div className="accordion-item">
                                <h2 className="accordion-header" id={`heading${question._id}${index}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${question._id}${index}`} aria-expanded="true" aria-controls={`collapse${question._id}${index}`}>
                                    Question:&nbsp; <strong>{index+1}</strong>
                                </button>
                                </h2>
                                <div id={`collapse${question._id}${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${question._id}${index}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <strong>{question.statement}</strong>
                                    <br />
                                    <br />
                                    <ul>
                                        <li>{question.options[0]}</li>
                                        <li>{question.options[1]}</li>
                                        <li>{question.options[2]}</li>
                                        <li>{question.options[3]}</li>
                                    </ul>
                                    <br />
                                    Answer: <strong>{question.options[question.correctAns]}</strong>
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>: <span className='my-3'>There are no easy questions for this quiz</span>}
                {/* {easyQuestions === [] && <span>There are no easy questions for this quiz</span>} */}
            </div>
            <hr />
            <div className="medium-questions">
                <h1>Medium Questions</h1>
                {mediumQuestions.length !== 0 ? <div className="accordion" id="accordionExample">
                    {mediumQuestions.map((question, index) => {
                        return (
                            <div className="accordion-item">
                                <h2 className="accordion-header" id={`heading${question._id}${index}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${question._id}${index}`} aria-expanded="true" aria-controls={`collapse${question._id}${index}`}>
                                    Question:&nbsp; <strong>{index+1}</strong>
                                </button>
                                </h2>
                                <div id={`collapse${question._id}${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${question._id}${index}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <strong>{question.statement}</strong>
                                    <br />
                                    <br />
                                    <ul>
                                        <li>{question.options[0]}</li>
                                        <li>{question.options[1]}</li>
                                        <li>{question.options[2]}</li>
                                        <li>{question.options[3]}</li>
                                    </ul>
                                    <br />
                                    Answer: <strong>{question.options[question.correctAns]}</strong>
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>: <span className='my-3'>There are no medium questions for this quiz</span>}
                {/* {mediumQuestions === [] && <span>There are no medium questions for this quiz</span>} */}
            </div>
            <hr />
            <div className="hard-questions">
                <h1>Hard Questions</h1>
                {hardQuestions.length !== 0 ? <div className="accordion" id="accordionExample">
                    {hardQuestions.map((question, index) => {
                        return (
                            <div className="accordion-item">
                                <h2 className="accordion-header" id={`heading${question._id}${index}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${question._id}${index}`} aria-expanded="true" aria-controls={`collapse${question._id}${index}`}>
                                    Question:&nbsp; <strong>{index+1}</strong>
                                </button>
                                </h2>
                                <div id={`collapse${question._id}${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${question._id}${index}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <strong>{question.statement}</strong>
                                    <br />
                                    <br />
                                    <ul>
                                        <li>{question.options[0]}</li>
                                        <li>{question.options[1]}</li>
                                        <li>{question.options[2]}</li>
                                        <li>{question.options[3]}</li>
                                    </ul>
                                    <br />
                                    Answer: <strong>{question.options[question.correctAns]}</strong>
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>: <span className='my-3'>There are no hard questions for this quiz</span>}
                {/* {hardQuestions === [] && <span>There are no hard questions for this quiz</span>} */}
            </div>
            <div className="last-buttons my-3">
                <button onClick={approveQuiz} type="button" class="btn btn-success mx-5">Approve Quiz</button>
                <button onClick={rejectQuiz} type="button" class="btn btn-danger mx-5">Reject Approval</button>
            </div>
        </div>
        <ToastContainer toastStyle={{ backgroundColor: "#202d40", color: 'white' }} />
    </div>
    </>
  )
}

export default Approvequiz