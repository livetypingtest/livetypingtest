import { NavLink } from "react-router-dom"

const Error404 = () => {
  return (
    <>
        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="img-404 ">
                            <img src="/assets/images/error.svg" alt="" />
                            <NavLink className='theme-btn sm' to='/'>Please return to the lobby page</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Error404