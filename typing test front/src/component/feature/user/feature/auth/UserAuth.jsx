import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import UserSignin from './UserSignin'
import UserSignup from './UserSignup'
import { GoogleOAuthProvider } from '@react-oauth/google'
import DynamicAlert from '../../../../shared/Toast/DynamicAlert'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetState } from '../../../../../redux/UserDataSlice'

const UserAuth = () => {

    const isError = useSelector(state => state.UserDataSlice.isError)
    const errorMsg = useSelector(state => state.UserDataSlice.errorMsg)
    const [alertDetail, setAlertDetail] = useState({
        title : '',
        message : '',
        type : '',
        navigateTo : '',
        confirmBtn : false
    })
    const [showAlert, setShowAlert] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if(isError) {
            if(errorMsg?.type === 'block-unblock') {
                setShowAlert(true)
                setAlertDetail({
                    title : 'Account Blocked!',
                    type : 'error',
                    message : `Your Account has been Blocked! Conatct to Admin`,
                    navigateTo : '',
                    confirmBtn : true
                })
            }
        }
    }, [isError, errorMsg])

    const handleAlertClose = () => {
        setShowAlert(false); // Set showAlert to false
        dispatch(resetState())
    };

  return (
    <>
        <Header />
        <GoogleOAuthProvider clientId="466565788678-qm48dd40fpu29rh75c2hh1tsoqvr8n8s.apps.googleusercontent.com">
        <section>
            <div className="container my-4">
                <div className="row align-items-start gap-40">
                    <div className="col-md-6">
                        <UserSignup />
                    </div>
                    <div className="col-md-6 ">
                        <UserSignin />
                    </div>
                </div>
            </div>
        </section>
        </GoogleOAuthProvider>

        <Footer />

        <DynamicAlert
            type={alertDetail.type}
            title={alertDetail.title}
            message={alertDetail.message}
            trigger={showAlert} // This will trigger the alert
            navigateTo={alertDetail.navigateTo}
            confirmBtn={alertDetail.confirmBtn}
            onClose={handleAlertClose} // Pass the onClose handler
        />
    </>
  )
}

export default UserAuth