import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Home = () => {
    const [data, setData] = useState([]);
    const [testInstitute, setTestInstitute] = useState("");
    const [isLinkAvailable, setIsLinkAvailable] = useState(false);
    const [myInstitute, setMyInstitute] = useState("");
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

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
    }, [myInstitute])
    
    
    const columns = [
        {
            name: 'Sno',
            selector: row => row.sno,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Institute',
            selector: row => (row.ownerInstitute).toUpperCase(),
            sortable: true,
        },
        {
            name: 'Owner',
            selector: row => row.ownerName,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: row => row.start,
            sortable: true,
        },
        {
            name: 'End Date',
            selector: row => row.end,
            sortable: true,
        },
        {
            name: 'Link',
            selector: row => row.link,
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