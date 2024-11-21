import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleBlockUnblockUser, handleGetAllUsers, resetState } from "../../../../redux/AdminDataSlice";
import { ADMIN_API_URL } from "../../../../util/API_URL";
import { NavLink } from "react-router-dom";
import { dynamicToast } from "../../../shared/Toast/DynamicToast";
import StateCircleLoader from "../../../shared/loader/StateCircleLoader";
import DeleteUserModal from "../modals/DeleteUserModal";
import axios from "axios";
import Pagination from '../../../shared/pagination/Pagination';
import * as XLSX from 'xlsx';

const AllUsers = () => {
    const dispatch = useDispatch();
    const rawAllUsersData = useSelector(state => state.AdminDataSlice.allUserData);
    const isFullfilled = useSelector((state) => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector((state) => state.AdminDataSlice.fullFillMsg);
    const [loader, setLoader] = useState(false);
    const isProcessing = useSelector((state) => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector((state) => state.AdminDataSlice.processingMsg);
    const [deleteUsername, setDeleteUsername] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        setLoader(true);
        try {
            const response = await axios.get(`${ADMIN_API_URL}/users?page=${page}`);
            if(response.data.status === 200){
                setLoader(false);
                dispatch(handleGetAllUsers(response.data.data));
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (rawAllUsersData?.length !== 0) {
            setUsers(rawAllUsersData);
        }
    }, [dispatch, rawAllUsersData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg?.type === "delete") {
                setLoader(false);
            }
            if (fullFillMsg?.type === 'block-unblock') {
                dynamicToast({ message: "Account Toggled Successfully!", icon: "success" });
                dispatch(resetState());
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg, dispatch]);

    useEffect(() => {
        if (processingMsg?.type === 'block-unblock') {
            dispatch(resetState());
        }
    }, [isProcessing, processingMsg, dispatch]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedUsers(users.map(user => user.username));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleCheckboxChange = (username) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(username)
                ? prevSelected.filter(user => user !== username)
                : [...prevSelected, username]
        );
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = dateString ? new Date(dateString) : null;
        return !isNaN(date) ? new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date) : '';
    };

    const exportSelectedToExcel = () => {
        const selectedUserData = users
            .filter(user => selectedUsers.includes(user.username))
            .map(({ username, email, accountid, createdate }) => ({
                Username: username,
                Email: email,
                AccountID: accountid,
                JoinedAt: formatDate(createdate)
                
            }));
        
        const worksheet = XLSX.utils.json_to_sheet(selectedUserData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Users");
        XLSX.writeFile(workbook, "User_Data.xlsx");
    };

    const blockUser = (username) => {
        dispatch(handleBlockUnblockUser(username));
    };


    return (
        <>
            <section>
                <div className="container pb-5 pt-7">
                    <div className="row">
                        <div className="col-md-12 py-4">
                            <div className="alluser-header">
                                <h1>All Active Users</h1>
                                {
                                    loader && (
                                        <div className="rl-loading-container">
                                            <div className="rl-loading-thumb rl-loading-thumb-1"></div>
                                            <div className="rl-loading-thumb rl-loading-thumb-2"></div>
                                            <div className="rl-loading-thumb rl-loading-thumb-3"></div>
                                        </div>
                                    )
                                }
                                <div className="bulk-action-layout-btn">
                                    <button onClick={exportSelectedToExcel} disabled={selectedUsers?.length !== 0 ? false : true} className="btn btn-primary my-3">
                                        Export Selected Users
                                    </button>
                                    <button onClick={()=>setDeleteUsername(selectedUsers)} disabled={selectedUsers?.length !== 0 ? false : true} data-bs-toggle="modal" data-bs-target="#deleteaccount" className="btn btn-danger my-3">
                                        {selectedUsers?.length !==0 ? `Delete ${selectedUsers?.length} Users` : 'Delete User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="alluser-table my-4">
                                <table className="table table-hover table-dark m-0 table-striped">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>View</th>
                                            <th>Edit</th>
                                            <th>Block</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((value, index) => (
                                            <tr key={value.username || index}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(value.username)}
                                                        onChange={() => handleCheckboxChange(value.username)}
                                                    />
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <div className="profile">
                                                            <img
                                                                src={
                                                                    value?.profile
                                                                        ? `${value?.profile}`
                                                                        : "/assets/images/profile.png"
                                                                }
                                                                alt=""
                                                            />
                                                            {value?.username}
                                                        </div>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <button className="btn">
                                                            <i className="fa-solid fa-eye fa-lg"></i>
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <button className="btn">
                                                            <i className="fa-solid fa-user-pen fa-lg" />
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <button className="btn" onClick={() => blockUser(value.username)}>
                                                        {!value.isblock ? (
                                                            <i className="fa-solid fa-shield-check fa-xl"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle-xmark fa-xl" />                                                      
                                                        )}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn" onClick={() => setDeleteUsername(value.username)} data-bs-toggle="modal" data-bs-target="#deleteaccount">
                                                        <i className="fa-solid fa-user-xmark fa-lg"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                        </div>
                    </div>
                </div>
            </section>

            {/* {loader && <StateCircleLoader />} */}
            <DeleteUserModal props={deleteUsername} />
        </>
    );
};

export default AllUsers;
