import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './createquiz.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { joinPaths } from '@remix-run/router';

const Createquiz = () => {
  const [quizName, setQuizName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalEasyQuestions, setTotalEasyQuestions] = useState(0);
  const [totalMediumQuestions, setTotalMediumQuestions] = useState(0);
  const [totalHardQuestions, setTotalHardQuestions] = useState(0);
  const [selectedEasyQuestions, setSelectedEasyQuestions] = useState(0);
  const [selectedMediumQuestions, setSelectedMediumQuestions] = useState(0);
  const [selectedHardQuestions, setSelectedHardQuestions] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);
  const [easyQuestions, setEasyQuestions] = useState([]);
  const [mediumQuestions, setMediumQuestions] = useState([]);
  const [hardQuestions, setHardQuestions] = useState([]);
  const [easyQuestionTracker, setEasyQuestionTracker] = useState([]);
  const [mediumQuestionTracker, setMediumQuestionTracker] = useState([]);
  const [hardQuestionTracker, setHardQuestionTracker] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  const getNoOfQuestions = async () => {
    const authtoken = localStorage.getItem('auth-token');
    const response = await fetch('http://localhost:8181/api/test/noofquestions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authtoken
      }
    });
    const json = await response.json();
    setTotalEasyQuestions(json.easy);
    setTotalMediumQuestions(json.medium);
    setTotalHardQuestions(json.hard);

    for (let i = 0; i <= json.easy; i++) {
      setEasyQuestionTracker(questions => questions.concat(i));
    }

    for (let j = 0; j <= json.medium; j++) {
      setMediumQuestionTracker(questions => questions.concat(j));
    }

    for (let k = 0; k <= json.hard; k++) {
      setHardQuestionTracker(questions => questions.concat(k));
    }
  }


  const getAllQuestions = async () => {
    const authtoken = localStorage.getItem('auth-token');
    const response = await fetch('http://localhost:8181/api/test/getallquestions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authtoken
      }
    });
    const json = await response.json();
    json.forEach(question => {
      if (question.difficulty === "easy") {
        setEasyQuestions(easy => easy.concat(question));
      }
      else if (question.difficulty === "medium") {
        setMediumQuestions(med => med.concat(question));
      }
      else {
        // question.difficulty === "hard"
        setHardQuestions(hard => hard.concat(question));
      }
    });
    setAllQuestions(json);
  }

  useEffect(() => {
    getNoOfQuestions();
    getAllQuestions();
  }, []);


  // useEffect(() => {
  //   console.log(easyQuestions);
  //   console.log(mediumQuestions);
  //   console.log(hardQuestions);
  // }, [easyQuestions]);
  

  const changedEasy = (e) => {
    setSelectedEasyQuestions(e.target.value);
    // setTotalMarks(totalMarks + (e.target.value*1));
  }
  const changedMedium = (e) => {
    setSelectedMediumQuestions(e.target.value);
    // setTotalMarks(totalMarks + (e.target.value*3));
  }
  const changedHard = (e) => {
    setSelectedHardQuestions(e.target.value);
    // setTotalMarks(totalMarks + (e.target.value*5));
  }
  

  useEffect(() => {
    setTotalMarks((selectedEasyQuestions*1) + (selectedMediumQuestions*3) + (selectedHardQuestions*5));
  }, [selectedEasyQuestions, selectedMediumQuestions, selectedHardQuestions]);
  
  


  const submitQuiz = async (e) => {
    e.preventDefault();
    if (startDate.getDay() === endDate.getDay() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      toast.error("The start and end date of a quiz can't be same");
    }
    else {
      const moment1 = moment(startDate);
      const moment2 = moment(endDate);
      if (moment2.isSameOrAfter(moment1)) {
        // Submit the form here
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:8181/api/test/submitquiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authtoken
          }, body: JSON.stringify({
              noOfEasyQuestions: parseInt(selectedEasyQuestions),
              noOfMediumQuestions: parseInt(selectedMediumQuestions),
              noOfHardQuestions: parseInt(selectedHardQuestions),
              name: quizName,
              start: moment(startDate),
              end: moment(endDate),
              totalMarks: parseInt(totalMarks),
            })
        });
        const json = await response.json();
        if (json.name) {
          setSelectedEasyQuestions(0);
          setSelectedMediumQuestions(0);
          setSelectedHardQuestions(0);

          setStartDate(new Date());
          setEndDate(new Date());
          
          setQuizName("");

          toast.success("Success! Your Test has been sent to the Admin for the Approval");
        }
        else {
          toast.error("Internal Server Error");
        }
      }
      else {
        toast.error("End Date of the Quiz should be after the Start Date");
      }
    }
    if (totalMarks === 0) {
      toast.error("You should at least select one or more questions");
    }
    else {
      if (quizName.trim() === "") {
        toast.error("Please Enter the Quiz Name");
      }
      // else {}
    }
  }

  return (
    <>
    <Navbar />
    <div className='container form2-container mt-5'>
        <h2 className='mb-4 login-heading'>Create A New Quiz (Total Marks: {totalMarks})</h2>
        <form>
            <div className="mb-3">
                <label className="form-label">Quiz Name</label>
                <input value={quizName} onChange={(e) => setQuizName(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="dates">
              <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  {/* <input type="date" className="form-control" id="exampleInputPassword1" /> */}
                  <DatePicker wrapperClassName="datePicker" dateFormat={"dd/MM/yyyy"} selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
              <div className="mb-3">
                  <label className="form-label">End Date</label>
                  {/* <input type="date" className="form-control" id="exampleInputPassword1" /> */}
                  <DatePicker wrapperClassName="datePicker" dateFormat={"dd/MM/yyyy"} selected={endDate} onChange={(date) => setEndDate(date)} />
              </div>
            </div>
            <div className="select-menu">
              <label className="form-label my-2">Number of Easy Questions</label>
              <select value={selectedEasyQuestions} onChange={changedEasy} defaultValue="0" className="form-select" aria-label="Default select example">
                {easyQuestionTracker.map((question) => {
                  return (
                    <option key={question} value={question}>{question}</option>
                  );
                })}
              </select>
            </div>
            <div className="select-menu">
              <label className="form-label my-2">Number of Medium Questions</label>
              <select value={selectedMediumQuestions} onChange={changedMedium} defaultValue="0" className="form-select" aria-label="Default select example">
                {mediumQuestionTracker.map((question) => {
                  return (
                    <option key={question} value={question}>{question}</option>
                  );
                })}
              </select>
            </div>
            <div className="select-menu">
              <label className="form-label my-2">Number of Hard Questions</label>
              <select value={selectedHardQuestions} onChange={changedHard} defaultValue="0" className="form-select" aria-label="Default select example">
                {hardQuestionTracker.map((question) => {
                  return (
                    <option key={question} value={question}>{question}</option>
                  );
                })}
              </select>
            </div>
            <button style={{ width: '100%' }} onClick={submitQuiz} type="submit" id='login-button' className="btn btn-primary mt-4">Submit the Quiz</button>
        </form>
        <ToastContainer toastStyle={{ backgroundColor: "#202d40", color: 'white' }} />
    </div>
    </>
  )
}

export default Createquiz