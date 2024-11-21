import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { handleSigninUserWithGoogle, handleSignupWithGoogle } from '../../../../../redux/UserDataSlice';

const GoogleAuth = (props) => {
    const dispatch = useDispatch()

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          const token = tokenResponse.access_token; // This is the access_token
      
          if (token) {
            try {
            if(props.props === 'Sign In') {
              dispatch(handleSigninUserWithGoogle(token))
            } else dispatch(handleSignupWithGoogle(token))
            } catch (error) {
              console.error("Error fetching user info:", error);
            }
          } else {
            console.error("No token found in the response");
          }
        },
        onError: (error) => {
          console.error('Login Failed:', error); // Handle login failure
        },
      });
      
      

  return (
    <button onClick={handleGoogleLogin} className='google-sign-btn'><img src="/assets/images/google.svg" alt="" />{props.props} with Google</button>
  );
};

export default GoogleAuth;

