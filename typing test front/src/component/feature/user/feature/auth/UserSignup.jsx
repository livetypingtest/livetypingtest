import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import UserSignupSchema from '../../../../../schemas/UserSignupSchema'
import { useDispatch, useSelector } from 'react-redux'
import { handleCreateUser, resetState } from '../../../../../redux/UserDataSlice'
import { useNavigate } from 'react-router-dom'
import GoogleAuth from './GoogleAuth'

const UserSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const errorMsg = useSelector(state => state.UserDataSlice.errorMsg)
  const [eye, setEye] = useState({ pass: false, repass: false })
  const [loader, setLoader] = useState(false)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)

  // State to handle Google signup
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const signupForm = useFormik({
    validationSchema: UserSignupSchema,
    initialValues: {
      username: '',
      email: '',
      password: '',
      repassword: '',
      createdate: null
    },
    validateOnBlur: !isGoogleSignup, // Skip validation on blur during Google signup
    validateOnChange: !isGoogleSignup, // Skip validation on change during Google signup
    onSubmit: async (formData) => {
      formData.createdate = new Date();
      dispatch(handleCreateUser(formData))
    }
  })

  const togglePasswordVisibility = (field) => {
    setEye(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  useEffect(() => {
    if (isProcessing) {
      if (processingMsg?.type === 'signup') {
        setLoader(true)
        dispatch(resetState())
      }
    }
  }, [isProcessing, processingMsg])

  useEffect(() => {
    if (isError) {
      
    }
  }, [isError])
  useEffect(() => {
    if(isError) {
      if(errorMsg?.type === 'signup') {
        setLoader(false)
        setTimeout(()=>{
          dispatch(resetState())
        }, 3000)
      }
      setTimeout(() => {
        dispatch(resetState())
      }, 4000)
    }
  }, [isError, errorMsg])

  useEffect(() => {
    if (isFullfilled) {
      if (fullFillMsg?.type === 'signup') {
        navigate(`/`)
        dispatch(resetState())
      }
    }
  }, [isFullfilled, fullFillMsg])


  return (
    <>
      <form onSubmit={signupForm.handleSubmit}>
        <h4 className='font-active text-left'>Create an Account</h4>
        {
          errorMsg?.type === 'signup' ? (<small className='text-danger'>{errorMsg?.message}</small>) : null
        }
        <div className='auth-input my-3'>
          <div className="auth">
            <input type="text" name='username' onChange={signupForm.handleChange} placeholder='User Name' />
            <i className="fa-solid fa-user fa-sm" style={{ color: "#8c8c8c" }} />
          </div>
          {
            signupForm.errors.username && signupForm.touched.username && (<small className='text-danger'>{signupForm.errors.username}</small>)
          }
          <div className="auth">
            <input type="email" name='email' onChange={signupForm.handleChange} placeholder='Email Address' />
            <i className="fa-solid fa-envelope fa-sm" style={{ color: '#8c8c8c' }}></i>
          </div>
          {
            signupForm.errors.email && signupForm.touched.email && (<small className='text-danger'>{signupForm.errors.email}</small>)
          }
          <div className="auth">
            <input
              type={eye.pass ? "text" : "password"}
              name='password'
              onChange={signupForm.handleChange}
              placeholder='Password'
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('pass')}
            >
              {eye.pass ? (
                <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
              ) : (
                <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
              )}
            </button>
          </div>
          {
            signupForm.errors.password && signupForm.touched.password && (<small className='text-danger'>{signupForm.errors.password}</small>)
          }

          <div className="auth">
            <input
              type={eye.repass ? "text" : "password"}
              name='repassword'
              onChange={signupForm.handleChange}
              placeholder='Confirm Password'
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('repass')}
            >
              {eye.repass ? (
                <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
              ) : (
                <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
              )}
            </button>
          </div>
          {
            signupForm.errors.repassword && signupForm.touched.repassword && (<small className='text-danger'>{signupForm.errors.repassword}</small>)
          }
          <button type='submit' className='theme-btn lg width-90'>Sign Up {loader ? <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#15131a" }} /> : null}</button>
          <div className='width-90'><p className='font-idle text-center'>or</p></div>
        </div>
      </form>
          <div className='d-flex justify-content-center width-90'>
            <GoogleAuth onClick={()=>setIsGoogleSignup(true)} props={'Sign Up'} />
          </div>
    </>
  )
}

export default UserSignup
