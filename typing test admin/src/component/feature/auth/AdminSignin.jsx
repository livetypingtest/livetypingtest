import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import { emailSchema, usernameSchema } from '../../../schemas/UserSigninSchema';
import { handleSigninAdmin, resetState } from '../../../redux/AdminDataSlice';


// Helper function to check if the input is an email
const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const AdminSignin = () => {

  const dispatch = useDispatch();
  const [schema, setSchema] = useState(usernameSchema); // Default to username schema
  const [inputType, setInputType] = useState('username'); // To store 'email' or 'username'
  const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing)
  const processingMsg = useSelector(state => state.AdminDataSlice.isProcessing)
  const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled)
  const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg)
  const isError = useSelector(state => state.AdminDataSlice.isError)
  const errorMsg = useSelector(state => state.AdminDataSlice.errorMsg)
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [eye, setEye] = useState(false)
  const [loader, setLoader] = useState(false)


  const adminSigninForm = useFormik({
    initialValues: {
      signin: '',
      password: '',
      type : null
    },
    validationSchema: schema, // Dynamically set schema
    onSubmit: async(formData) => {
      formData.type = inputType
      // console.log(formData)
      dispatch(handleSigninAdmin(formData))
    },
  });

  const handleSigninChange = (e) => {
    const value = e.target.value;
    adminSigninForm.handleChange(e); // Update formik values

    // Determine if it's an email or username, and change the schema accordingly
    if (isEmail(value)) {
      setSchema(emailSchema);
      setInputType('email');
    } else {
      setSchema(usernameSchema);
      setInputType('username');
    }
  };

  useEffect(() => {
    if(isProcessing) {
      if(processingMsg?.type === 'signin') {
        setLoader(true)
        dispatch(resetState())
      } else setLoader(false)
    } 
  }, [isProcessing, processingMsg])

  useEffect(() => {
    if(isError) {
      setTimeout(()=>{
        dispatch(resetState())
      }, 4000)
    }
  }, [isError])

  useEffect(() => {
    if(isFullfilled) {
      if(fullFillMsg?.type === 'signin'){
        navigate(`/admin`)
        dispatch(resetState())
      }
    }
  }, [isFullfilled, fullFillMsg])


  return (
    <>


      {/* <section>
        <div className="container">
          <div className="row">
            <div className="offset-md-2 col-md-8">
            <form onSubmit={adminSigninForm.handleSubmit}>
            <h4 className='font-active text-left'>Signin To Admin Dashboard</h4>
            {
              errorMsg?.type === 'signin' ? (<small className='text-danger'>{errorMsg?.message}</small>) : null
            }
            <div className='auth-input my-4'>
              
              <div className="auth">
              <input onChange={handleSigninChange} // Custom handler for changing schema
                onBlur={adminSigninForm.handleBlur}
                value={adminSigninForm.values.signin}
                required
                name='signin' type="text" placeholder='Email' />
              </div>

              <div className="auth">
              <input onChange={adminSigninForm.handleChange}
                onBlur={adminSigninForm.handleBlur}
                value={adminSigninForm.values.password}
                required
                name='password' type={eye ? 'text' : 'password'} placeholder='Password' />
                <button
                    type="button"
                    onClick={() => setEye(!eye)}
                  >
                    {eye ? (
                      <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
                    ) : (
                      <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
                    )}
                  </button>
              </div>

              <div className='d-flex align-items-center justify-content-between width-90'>
                <div><input type='checkbox' /> <label className='font-idle'> &nbsp; Remember Me</label></div>
                <NavLink to='' className='font-idle'>Forgot Password?</NavLink>
              </div>
              <button type='submit' className='theme-btn lg width-90'>Sign In  { loader ? <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#15131a" }} /> : null }</button>
            </div>
            </form>
            </div>
          </div>
        </div>
      </section> */}

      <div
        className="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="row justify-content-center w-100">
              <div className="col-md-8 col-lg-8 col-xxl-3">
                <div className="card mb-0">
                  <form onSubmit={adminSigninForm.handleSubmit}>
                  <div className="card-body">
                    <a
                      href="./index.html"
                      className="text-nowrap logo-img text-center d-block py-3 w-100"
                    >
                      <img
                        src="./assets/images/logo.svg"
                        width={180}
                        alt=""
                      />
                    </a>
                    <p className="text-center">Login to Admin Panel</p>
                  
                      <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                          Username
                        </label>
                        <input
                          className="form-control"
                          onChange={handleSigninChange} // Custom handler for changing schema
                          onBlur={adminSigninForm.handleBlur}
                          value={adminSigninForm.values.signin}
                          required
                          name='signin' type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                          Password
                        </label>
                        <input
                          className="form-control"
                          onChange={adminSigninForm.handleChange}
                          onBlur={adminSigninForm.handleBlur}
                          value={adminSigninForm.values.password}
                          required
                          name='password'
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input primary"
                            type="checkbox"
                            defaultValue=""
                            id="flexCheckChecked"
                            defaultChecked=""
                          />
                          <label
                            className="form-check-label text-dark"
                            htmlFor="flexCheckChecked"
                          >
                            Remeber this Device
                          </label>
                        </div>
                        <a className="text-primary fw-bold" href="./index.html">
                          Forgot Password ?
                        </a>
                      </div>
                      <button
                        type='submit'
                        className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                      >
                        Sign In
                      </button>
                   
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default AdminSignin