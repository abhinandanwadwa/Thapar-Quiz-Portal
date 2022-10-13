import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, Link } from 'react-router-dom';
import modeContext from '../../context/ModeContext';
import Navbar from '../Navbar/Navbar';

const Home = () => {
    const [data, setData] = useState([]);
    const [testInstitute, setTestInstitute] = useState("");
    const [isLinkAvailable, setIsLinkAvailable] = useState(false);
    const [myInstitute, setMyInstitute] = useState("");
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();


    const mode_context = useContext(modeContext);
    const { darkMode } = mode_context;

    const getMyDetails = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:8181/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        setMyInstitute(json.institute);
    }

    const getAllAcceptedTests = async () => {
        const authtoken = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:8181/api/test/getallaccepted', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });
        const json = await response.json();
        let sno = 1;
        json.forEach(element => {
            let startDate = element.start;
            let endDate = element.end;
            element.sno = sno++;
            element.start = moment(element.start).calendar();
            element.end = moment(element.end).calendar();
            if ((moment(new Date()).isAfter(startDate) && moment(new Date()).isBefore(endDate)) && element.ownerInstitute === myInstitute) {
                element.link = "localhost:3000/test/test_id";
            }
            else {
                element.link = "Not Available"
            }
        });
        setData(json);
        console.log(json);
    }

    useEffect(() => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        }
        getMyDetails();
    }, []);

    useEffect(() => {
        getAllAcceptedTests();
    }, [myInstitute]);


    useEffect(() => {
        if (darkMode) {
            document.body.style.backgroundColor = "black"
        }
        else {
            document.body.style.backgroundColor = "white"
        }
    }, [darkMode])
    
    
    
    const columns = [
        {
            name: 'Sno',
            selector: row => row.sno,
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'Institute',
            selector: row => (row.ownerInstitute).toUpperCase(),
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'Owner',
            selector: row => row.ownerName,
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'Start Date',
            selector: row => row.start,
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'End Date',
            selector: row => row.end,
            sortable: true,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
        {
            name: 'Link',
            selector: row => row.link,
            style: {
                background: darkMode?"#4d4d4d":'white',
                color: darkMode?"white":'black',
                transition: "all 0.2s",
            },
        },
    ];

    let serialNo = 1;
    
    // data = [
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "Not Available"
    //     },
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "Not Available"
    //     },
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "Not Available"
    //     },
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "https://www.google.com"
    //     },
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "Not Available"
    //     },
    //     {
    //         id: serialNo,
    //         sno: serialNo++,
    //         name: "UCS009",
    //         institute: "TIET",
    //         owner: "PSRana",
    //         start: "24th November",
    //         end: "7th December",
    //         link: "Not Available"
    //     },
    // ]
  return (
    <>
    <Navbar />
    <div className="table container">
        <DataTable
            columns={columns}
            data={data}
            pagination  
        />
    </div>
    </>
  )
}

export default Home