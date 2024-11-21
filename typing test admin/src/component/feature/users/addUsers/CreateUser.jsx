import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useFormik} from 'formik'
import { useEffect, useState } from "react";
import { handleCreateUser, resetState } from "../../../../redux/AdminDataSlice";
import UserSignupSchema from '../../../../schemas/UserSignupSchema'

const CreateUser = () => {

    const dispatch = useDispatch();
  const navigate = useNavigate()
  const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing)
  const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg)
  const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled)
  const isError = useSelector(state => state.AdminDataSlice.isError)
  const errorMsg = useSelector(state => state.AdminDataSlice.errorMsg)
  const [eye, setEye] = useState({pass : false, repass : false})
  const [loader, setLoader] = useState(false)
  const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg)

  const signupForm = useFormik({
    validationSchema : UserSignupSchema,
    initialValues : {
      username : '',
      email : '',
      password : '',
      repassword : '',
      createdate : null
    },
    onSubmit : async(formData) => {
      formData.createdate = new Date();
      // console.log(formData)
      dispatch(handleCreateUser(formData))
    }
  })

  const togglePasswordVisibility = (field) => {
    setEye(prevState => ({ ...prevState, [field]: !prevState[field] }));
  };

  useEffect(() => {
    if(isProcessing) {
      if(processingMsg?.type === 'signup') {
        setLoader(true)
        dispatch(resetState())
      } else setLoader(false)
    } 
  }, [isProcessing, processingMsg])


  useEffect(() => {
    if(isError) {
        setLoader(false)
        setTimeout(()=>{
            dispatch(resetState())
        }, 4000)
    }
  }, [isError])

  useEffect(() => {
    if(isFullfilled) {
      if(fullFillMsg?.type === 'signup'){
        navigate(`/admin/users`)
        dispatch(resetState())
      }
    }
  }, [isFullfilled, fullFillMsg])

  return (
    <>
        <section>
            <div className="container pb-5 pt-7">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-main-layout p-35">
                        <form onSubmit={signupForm.handleSubmit}>
                            <h4 className='font-active text-left'>Create User</h4>
                            {
                            errorMsg?.type === 'signup' ? (<small className='text-danger'>{errorMsg?.message}</small>) : null
                            }
                            <div className='auth-input my-4'>
                            <div className="auth">
                            <input  type="text" name='username' onChange={signupForm.handleChange} placeholder='User Name' />
                            <button className="btn"><i className="fa-solid fa-user fa-sm" style={{ color: "#8c8c8c" }} /></button>
                            </div>
                            <div className="auth">
                            <input  type="email" name='email' onChange={signupForm.handleChange} placeholder='Email Address' />
                            <button type="button" className="btn"><i class="fa-solid fa-envelope fa-sm" style={{color : '#8c8c8c'}}></i></button>
                            </div>
                            <div className="auth">
                                <input
                                type={eye.pass ? "text" : "password"}
                                name='password'
                                onChange={signupForm.handleChange}
                                placeholder='Password'
                                />
                                <button
                                type="button"
                                className="btn"
                                onClick={() => togglePasswordVisibility('pass')}
                                >
                                {eye.pass ? (
                                    <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
                                ) : (
                                    <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
                                )}
                                </button>
                            </div>

                            <div className="auth">
                                <input
                                type={eye.repass ? "text" : "password"}
                                name='repassword'
                                onChange={signupForm.handleChange}
                                placeholder='Confirm Password'
                                />
                                <button
                                type="button"
                                className="btn"
                                onClick={() => togglePasswordVisibility('repass')}
                                >
                                {eye.repass ? (
                                    <i className="fa-solid fa-eye fa-sm" style={{ color: "#8c8c8c" }} />
                                ) : (
                                    <i className="fa-solid fa-eye-slash fa-sm" style={{ color: "#8c8c8c" }} />
                                )}
                                </button>
                            </div>
                            <button type='submit' className='btn btn-primary'>Create &nbsp; { loader ? <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#15131a" }} /> : null }</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default CreateUser