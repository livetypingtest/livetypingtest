import { useEffect, useState } from "react";
import {NavLink} from 'react-router-dom'
import { dynamicToast } from "../../shared/Toast/DynamicToast";
import { useSelector } from 'react-redux';
import HomePageSEO from "../SEO/HomePageSEO";
import DynamicTitle from "../../shared/helmet/DynamicTitle";
import Notice from "../notice/Notice";
import UserAnalytics from "./UserAnalytics";

const AdminDashBoard = () => {
    const adminData = useSelector(state => state.AdminDataSlice.adminData);
    const [paraLength, setParaLength] = useState(0);

    useEffect(() => {
        if (adminData) {
            const levels = ['Min1', 'Min3', 'Min5'];
            const totalLength = levels.reduce((acc, level) => {
                const paras = adminData.paragraphs?.[level];
                return acc + ((paras?.easy?.length || 0) + (paras?.medium?.length || 0) + (paras?.hard?.length || 0));
            }, 0);
            setParaLength(totalLength);
        }
    }, [adminData]); // Only depend on adminData

    useEffect(() => {
        if (localStorage.getItem('isSignin')) {
            dynamicToast({ message: 'Logged in Successfully!', timer : 3000, icon: 'success' });
            setTimeout(() => {
                localStorage.removeItem('isSignin');
            }, 3500);
        }
    }, []);

    return (
        
        <section>
        <DynamicTitle title={"Live Typing Test | Dashboard"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Dashboard"}  />
            <div className="container pt-7">
                <div className="row">
                    <div className="col-sm-3 col-6 col-lg-3 col-xl-3">
                        <NavLink
                            to='/admin/users'
                            className="p-4 text-center bg-light-primary card shadow-none rounded-2"
                        >
                            <img
                                src="./assets/images/people.svg"
                                width={50}
                                height={50}
                                className="mb-6 mx-auto"
                                alt=""
                            />
                            <p className="fw-semibold text-primary mb-1">Users</p>
                            <h4 className="fw-semibold text-primary mb-0">{adminData?.userCount?.length}</h4>
                        </NavLink>
                    </div>
                    <div className="col-sm-3 col-6 col-lg-3 col-xl-3">
                        <NavLink
                            to='/admin/blog'
                            className="p-4 text-center bg-light-warning card shadow-none rounded-2"
                        >
                            <img
                                src="./assets/images/web.svg"
                                width={50}
                                height={50}
                                className="mb-6 mx-auto"
                                alt=""
                            />
                            <p className="fw-semibold text-warning mb-1">Blog</p>
                            <h4 className="fw-semibold text-warning mb-0">{adminData?.blogCount}</h4>
                        </NavLink>
                    </div>
                    <div className="col-sm-3 col-6 col-lg-3 col-xl-3">
                        <NavLink
                            to='/admin/users'
                            className="p-4 text-center bg-light-info card shadow-none rounded-2"
                        >
                            <img
                                src="./assets/images/padlock.svg"
                                width={50}
                                height={50}
                                className="mb-6 mx-auto"
                                alt=""
                            />
                            <p className="fw-semibold text-info mb-1">Block Users</p>
                            <h4 className="fw-semibold text-info mb-0">{adminData?.block?.length}</h4>
                        </NavLink>
                    </div>
                    <div className="col-sm-3 col-6 col-lg-3 col-xl-3">
                        <NavLink
                            to='/admin/paragraphs'
                            className="p-4 text-center bg-light-danger card shadow-none rounded-2"
                        >
                            <img
                                src="./assets/images/para.svg"
                                width={50}
                                height={50}
                                className="mb-6 mx-auto"
                                alt=""
                            />
                            <p className="fw-semibold text-danger mb-1">Paragraphs</p>
                            <h4 className="fw-semibold text-danger mb-0">{paraLength}</h4>
                        </NavLink>
                    </div>
                    <div className="col-md-12 ">
                        <UserAnalytics user={adminData?.userCount} />
                    </div>
                    {/* <div className="col-md-12 ">
                        <HomePageSEO />
                    </div> */}
                    <div className="col-md-12 ">
                        <Notice />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminDashBoard;
