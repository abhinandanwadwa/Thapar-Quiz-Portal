import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        }
    }, []);
    
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
            selector: row => row.institute,
            sortable: true,
        },
        {
            name: 'Owner',
            selector: row => row.owner,
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
            cell: () => <Link to={'/test'}>Action</Link>
        },
    ];

    let serialNo = 1;
    const data = [
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "Not Available"
        },
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "Not Available"
        },
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "Not Available"
        },
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "https://www.google.com"
        },
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "Not Available"
        },
        {
            id: serialNo,
            sno: serialNo++,
            name: "UCS009",
            institute: "TIET",
            owner: "PSRana",
            start: "24th November",
            end: "7th December",
            link: "Not Available"
        },
    ]
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