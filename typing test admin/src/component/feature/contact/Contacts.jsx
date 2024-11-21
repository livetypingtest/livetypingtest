import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { handleDeleteBulkContactData, handleDeleteSingleContactData, handleGetContactData } from '../../../redux/DynamicPagesDataSlice';

const Contacts = () => {
    const contactData = useSelector(state => state.DynamicPagesDataSlice.contact);
    const dispatch = useDispatch();
    const [selectedIds, setSelectedIds] = useState([]);

    function formatDate(timestamp) {
        // Check if timestamp is a valid date
        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            return "Invalid Date"; // Return a default value if the timestamp is invalid
        }
        
        const date = new Date(timestamp);
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const time = new Intl.DateTimeFormat('en-US', options).format(date);
        
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        return `${time} ${day}${month} ${year}`;
    }

    // Toggle selection of a single contact
    const toggleSelectContact = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    // Select all contacts
    const toggleSelectAll = () => {
        if (selectedIds.length === contactData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(contactData.map(contact => contact._id));
        }
    };

    // Delete selected contacts
    const deleteSelectedContacts = () => {
        dispatch(handleDeleteBulkContactData(selectedIds))
        setSelectedIds([]);
    };


    return (
        <>
            <section>
                <div className="container pt-7 pb-5">
                    <div className="row pt-7">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                <div className="contact-show-header ">
                                    <h4>Contact</h4>
                                    <button className='btn' onClick={()=>dispatch(handleGetContactData())}><i class="fa-solid fa-rotate fa-2xl"></i></button>
                                </div>
                                </div>
                                <div className="card-body">
                                    <div className='alluser-table'>
                                        <table className="table table-hover table-striped table-dark">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.length === contactData.length}
                                                            onChange={toggleSelectAll}
                                                        />
                                                    </th>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                    <th>Operations</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contactData?.length !== 0 && contactData?.map((value, index) => (
                                                        <tr key={value._id}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIds.includes(value._id)}
                                                                    onChange={() => toggleSelectContact(value._id)}
                                                                />
                                                            </td>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <NavLink to={`/admin/contact/${value._id}`}>
                                                                    {value?.name}
                                                                </NavLink>
                                                            </td>
                                                            <td>{value?.email}</td>
                                                            <td>{formatDate(value?.time)}</td>
                                                            <td>
                                                                <span className={`mb-1 badge rounded-pill ${value.status === 'unseen' ? 'bg-warning' : 'bg-info'}`}>
                                                                    {value.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className='btn p-0'
                                                                    onClick={() => dispatch(handleDeleteSingleContactData(value?._id))}
                                                                >
                                                                    <i className="fa-solid fa-trash-can fa-lg" style={{ color: "#d41111" }} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button 
                                        className="btn btn-danger mt-3" 
                                        onClick={deleteSelectedContacts} 
                                        disabled={selectedIds.length === 0}
                                    >
                                        Delete Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contacts;
