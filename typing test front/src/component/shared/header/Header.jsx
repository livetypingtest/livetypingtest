import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import GoogleADs from '../googleAds/GoogleADs';
import { useSelector } from 'react-redux';


const Header = () => {
    const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);
    const checkAdminToken = useMemo(() => !!localStorage.getItem('adminToken'), []);
    const userData = useSelector(state => state.UserDataSlice.userData);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="container p-custom">
                <div className="row align-items-center">
                    <div className="col-md-4 col-12">
                        <div className="custom-header">
                            <div className="header">
                                <NavLink to={checkUserToken ? '/' : '/'}><img src="/assets/images/logo.svg" alt="Logo" /></NavLink>
                            </div>
                            <button className="menu-toggle mob-show" onClick={toggleMenu}>
                                <i className={`fa-solid ${isOpen ? 'fa-xmark' :'fa-bars'} fa-xl`} style={{ color: "#71cac7" }} />
                            </button>
                        </div>
                    </div>
                    <div className="col-md-8 col-12">
                        <div className="header desk-show">
                            <ul className="menu">
                                {checkUserToken ? (
                                    <>
                                        <NavLink to='/'><li>Start Live Test</li></NavLink>
                                        <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                                        <NavLink to='/blog'><li>Blogs</li></NavLink>
                                        <li className="dropdown">
                                            <NavLink to='/dashboard'><li className='header-profile'><img src={userData?.profileimage?.s3url ? `${userData?.profileimage?.s3url}` : '/assets/images/profile.png'} alt="" /> {userData?.username} </li></NavLink>
                                            <ul className="dropdown-menu">
                                                <NavLink to='/dashboard'><li>Profile</li></NavLink>
                                                <NavLink to={`/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                            </ul>
                                        </li>
                                    </>
                                ) 
                                // : checkAdminToken ? (
                                //     <>
                                //         <NavLink to='/admin/leaderboard'><li>Leaderboard</li></NavLink>
                                //         <NavLink to='/admin/paragraphs'><li>Paragraphs</li></NavLink>
                                //         <NavLink to='/admin/blog'><li>Blogs</li></NavLink>
                                //         <li className="dropdown">
                                //             <NavLink to='/admin/users'> User</NavLink>
                                //             <ul className="dropdown-menu">
                                //                 <NavLink to='/admin/add-user'><li>Add User</li></NavLink>
                                //                 <NavLink to='/admin/delete-user'><li>Delete User</li></NavLink>
                                //             </ul>
                                //         </li>
                                //         <NavLink to={`/admin/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                //     </>
                                // ) 
                                : (
                                    <>
                                        <NavLink to='/'><li>Start Live Test</li></NavLink>
                                        <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                                        <NavLink to='/blog'><li>Blogs</li></NavLink>
                                        {/* <NavLink to='/about'><li>About</li></NavLink> */}
                                        {/* <NavLink to='/contact'><li>Contact Us</li></NavLink> */}
                                        <NavLink to='/signup'><li> Login/Signup</li></NavLink>
                                    </>
                                )}
                            </ul>
                        </div>
                        {/* Mobile Menu Toggle */}
                        
                        <div className={`menu-slider mob-show ${isOpen ? 'open' : ''}`}>
                            <ul className="menu">
                                {checkUserToken ? (
                                    <>
                                        <NavLink to='/dashboard'><li className='header-profile'><img src={userData?.profileimage?.s3url ? `${userData?.profileimage?.s3url}` : '/assets/images/profile.png'} alt="" /> {userData?.username} </li></NavLink>
                                        <NavLink to='/'><li>Start Live Test</li></NavLink>
                                        <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                                        <NavLink to='/blog'><li>Blogs</li></NavLink>
                                        <NavLink to={`/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                    </>
                                )
                                // : checkAdminToken ? (
                                //     <>
                                //         <NavLink to='/admin/leaderboard'><li>Leaderboard</li></NavLink>
                                //         <NavLink to='/admin/paragraphs'><li>Paragraphs</li></NavLink>
                                //         <NavLink to='/admin/blog'><li>Blogs</li></NavLink>
                                //         <li className="dropdown">
                                //             <NavLink to='/admin/users'> User</NavLink>
                                //             <ul className="dropdown-menu">
                                //                 <NavLink to='/admin/add-user'><li>Add User</li></NavLink>
                                //                 <NavLink to='/admin/delete-user'><li>Delete User</li></NavLink>
                                //             </ul>
                                //         </li>
                                //         <NavLink to={`/admin/signout/${'isSignout'}`}><li>Logout</li></NavLink>
                                //     </>
                                // )
                                : (
                                    <>
                                        <NavLink to='/'><li>Start Live Test</li></NavLink>
                                        <NavLink to='/leaderboard'><li>Leaderboard</li></NavLink>
                                        <NavLink to='/blog'><li>Blogs</li></NavLink>
                                        {/* <NavLink to='/about'><li>About</li></NavLink> */}
                                        {/* <NavLink to='/contact'><li>Contact Us</li></NavLink> */}
                                        <NavLink to='/signup'><li> Login/Signup</li></NavLink>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* <div className="col-md-12 col-12"><GoogleADs /></div> */}
                </div>
            </div>
        </>
    );
};

export default Header;
