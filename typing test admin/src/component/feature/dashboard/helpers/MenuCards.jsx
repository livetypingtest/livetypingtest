import { NavLink } from "react-router-dom";

const MenuCards = ({adminData, paraLength}) => {
  return (
    <>

        <div className="col-sm-3 col-6 col-lg-3 col-xl-3">
            <NavLink
                to='/admin/users/list/all'
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
                to='/admin/users/list/block'
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
    </>
  )
}

export default MenuCards