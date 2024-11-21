import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import { emailSchema, usernameSchema } from '../../../../../schemas/UserSigninSchema';
import Header from '../../../../shared/header/Header';
import Footer from '../../../../shared/footer/Footer';
import { handleSigninAdmin, resetState } from '../../../../../redux/AdminDataSlice';


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
      <Header />

      <section>
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
      </section>

      <Footer />
    </>
  )
}

export default AdminSignin