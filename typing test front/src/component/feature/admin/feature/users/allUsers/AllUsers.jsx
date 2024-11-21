import { useEffect, useState } from "react";
import Header from "../../../../../shared/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { handleBlockUnblockUser, handleGetAllUser, resetState } from "../../../../../../redux/AdminDataSlice";
import { BASE_API_URL } from "../../../../../../util/API_URL";
import { NavLink } from "react-router-dom";
import { dynamicToast } from "../../../../../shared/Toast/DynamicToast";
import StateCircleLoader from "../../../../../shared/loader/StateCircleLoader";
import DeleteUserModal from "../modals/DeleteUserModal";

const AllUsers = () => {
    const dispatch = useDispatch();
    const rawUsersData = useSelector((state) => state.AdminDataSlice.allUserData);
    const isFullfilled = useSelector((state) => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector((state) => state.AdminDataSlice.fullFillMsg);
    const isProcessing = useSelector((state) => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector((state) => state.AdminDataSlice.processingMsg);
    const [loader, setLoader] = useState(false);
    const [deleteUsername, setDeleteUsername] = useState('')

    useEffect(() => {
        dispatch(handleGetAllUser());
    }, [dispatch]);

    

    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg?.type === "delete" || fullFillMsg?.type === "userData") {
                setLoader(false);
            }
            if(fullFillMsg?.type === 'block-unblock') {
                dynamicToast({ message: "Account Toggled Successfully!", icon: "success" });
                dispatch(resetState())
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg, dispatch]);

    useEffect(() => {
        if (isProcessing && processingMsg?.type === "userData") {
            setLoader(true);
            dispatch(resetState());
        }
        if(processingMsg?.type === 'block-unblock') {
            dispatch(resetState())
        }
        // dispatch(resetState());
    }, [isProcessing, processingMsg, dispatch]);

    const blockUser = (username) => {
        dispatch(handleBlockUnblockUser(username));
    };

    return (
        <>
            <Header />
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="leaderboard-table my-3">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>View</th>
                                            <th>Edit</th>
                                            <th>Block</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rawUsersData?.map((value, index) => (
                                            <tr key={value.username || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <div className="profile">
                                                            <img
                                                                src={
                                                                    value?.profile
                                                                        ? `${BASE_API_URL}/uploads/profile/${value?.profile}`
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
                                                        <button>
                                                            <i className="fa-solid fa-eye fa-lg"></i>
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <NavLink to="">
                                                        <button>
                                                            <i className="fa-solid fa-user-pen fa-lg" />
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <button onClick={() => blockUser(value.username)}>
                                                        {!value.isblock ? (
                                                            <i class="fa-solid fa-shield-check fa-xl"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle-xmark fa-xl" />                                                      
                                                        )}
                                                    </button>
                                                </td>
                                                <td>
                                                        <button onClick={()=>setDeleteUsername(value.username)} data-bs-toggle="modal" data-bs-target="#deleteaccount">
                                                            <i className="fa-solid fa-user-xmark fa-lg"></i>
                                                        </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {loader && <StateCircleLoader />}
            <DeleteUserModal props={deleteUsername} />
        </>
    );
};

export default AllUsers;
