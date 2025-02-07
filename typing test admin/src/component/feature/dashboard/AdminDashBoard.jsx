import { useEffect, useState } from "react";
import {NavLink} from 'react-router-dom'
import { dynamicToast } from "../../shared/Toast/DynamicToast";
import { useSelector } from 'react-redux';
import HomePageSEO from "../SEO/HomePageSEO";
import DynamicTitle from "../../shared/helmet/DynamicTitle";
import Notice from "../notice/Notice";
import UserAnalytics from "./UserAnalytics";
import MenuCards from "./helpers/MenuCards";

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
                    <MenuCards adminData={adminData} paraLength={paraLength} />
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
