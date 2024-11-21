import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Header = () => {
  // Memoized token checks
  const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);
  const checkAdminToken = useMemo(() => !!localStorage.getItem('adminToken'), []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationBadge, setNotificationBadge] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const contactData = useSelector(state => state.DynamicPagesDataSlice.contact)
  const adminData = useSelector(state => state.AdminDataSlice.adminData)

  useEffect(() => {
    if (contactData) {
      const unseenCount = contactData.reduce((count, item) => {
        return item.status === "unseen" ? count + 1 : count;
      }, 0);
  
      setNotificationBadge(unseenCount);
    }
  }, [contactData]);
  

  // Toggle function for the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    if(adminData) {
      setImagePath(adminData?.profileimage?.s3url)
    }
  }, [adminData])

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a
              className="nav-link sidebartoggler nav-icon-hover"
              id="headerCollapse"
              href="javascript:void(0)"
            >
              <i className="ti ti-menu-2" />
            </a>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link " to='/admin/contact'>
              <i className="ti ti-bell-ringing" />
              {
                notificationBadge !== 0 && (
                  <span class="cs-badge badge rounded-pill bg-warning">
                    {notificationBadge}
                    {/* <span class="visually-hidden">unread messages</span> */}
                  </span>
                )
              }
            </NavLink>
          </li>
        </ul>
        <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li className="nav-item dropdown">
              <NavLink
                to="/admin"
                className="nav-link nav-icon-hover"
                onClick={()=>setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility on click
              >
                <img
                  src={imagePath ? `${imagePath}` : "/assets/images/profile.png"}
                  alt="Profile"
                  width={35}
                  height={35}
                  className="rounded-circle"
                />
              </NavLink>

              {/* Show the dropdown menu if the state is true */}
              {isDropdownOpen && (
                <div  className="dropdown-menu custom-header-menu dropdown-menu-end dropdown-menu-animate-up">
                  <div className="message-body">
                    <NavLink to='/admin/profile'
                      className="d-flex align-items-center gap-2 dropdown-item"
                    >
                      <i className="ti ti-user fs-6" />
                      <p className="mb-0 fs-3">My Profile</p>
                    </NavLink>
                    <NavLink to='/admin/contact'
                      className="d-flex align-items-center gap-2 dropdown-item"
                    >
                      <i className="ti ti-user fs-6" />
                      <p className="mb-0 fs-3">Contacts</p>
                    </NavLink>
                    <NavLink
                      to={`/admin/signout/${'isSignout'}`}
                      className="btn btn-outline-primary mx-3 mt-2 d-block"
                      onClick={() => setIsDropdownOpen(false)} // Close dropdown after logout
                    >
                      Logout
                    </NavLink>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
