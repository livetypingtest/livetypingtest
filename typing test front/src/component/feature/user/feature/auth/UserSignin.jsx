// SignInForm.js
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { emailSchema, usernameSchema } from '../../../../../schemas/UserSigninSchema';
import { useDispatch, useSelector } from 'react-redux'
import { handleSigninUser, resetState } from '../../../../../redux/UserDataSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';

// Helper function to check if the input is an email
const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const UserSignin = () => {

  const dispatch = useDispatch();
  const [schema, setSchema] = useState(usernameSchema); // Default to username schema
  const [inputType, setInputType] = useState('username'); // To store 'email' or 'username'
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const errorMsg = useSelector(state => state.UserDataSlice.errorMsg)
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [eye, setEye] = useState(false)
  const [loader, setLoader] = useState(false)


  const userSigninForm = useFormik({
    initialValues: {
      signin: '',
      password: '',
      type : null
    },
    validationSchema: schema, // Dynamically set schema
    onSubmit: (formData) => {
      formData.type = inputType
      dispatch(handleSigninUser(formData))
    },
  });

  const handleSigninChange = (e) => {
    const value = e.target.value;
    userSigninForm.handleChange(e); // Update formik values

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
      }
    } 
  }, [isProcessing, processingMsg])

  useEffect(() => {
    if(isError) {
      if(errorMsg?.type === 'signin') {
        setLoader(false)
        setTimeout(()=>{
          dispatch(resetState())
        }, 3000)
      }
      if(errorMsg?.type === 'block-unblock') {
        
      }
    }
  }, [isError, errorMsg])

  useEffect(() => {
    if(isFullfilled) {
      if(fullFillMsg?.type === 'signin'){
        navigate(`/`)
        dispatch(resetState())
      }
    }
  }, [isFullfilled, fullFillMsg])

  return (
    <>
    

    <form onSubmit={userSigninForm.handleSubmit}>
      <h4 className='font-active text-left'>Already Have an account!</h4>
      {
        errorMsg?.type === 'signin' ? (<small className='text-danger'>{errorMsg?.message}</small>) : null
      }
      <div className='auth-input my-4'>
        
        <div className="auth">
        <input onChange={handleSigninChange} // Custom handler for changing schema
          onBlur={userSigninForm.handleBlur}
          value={userSigninForm.values.signin}
          required
          name='signin' type="text" placeholder='Email' />
        </div>

        <div className="auth">
        <input onChange={userSigninForm.handleChange}
          onBlur={userSigninForm.handleBlur}
          value={userSigninForm.values.password}
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
        <button type='submit' className='theme-btn lg width-90'>Sign In  { loader && <i className="fa-solid fa-circle-notch fa-spin " style={{ color: "#15131a" }} /> }</button>
        <div className='width-90'><p className='font-idle text-center'>or</p></div>
        <div className='d-flex justify-content-center width-90'>
          <GoogleAuth props={'Sign In'} />
        </div>
      </div>
      </form>
    </>
    
  );
};

export default UserSignin;
