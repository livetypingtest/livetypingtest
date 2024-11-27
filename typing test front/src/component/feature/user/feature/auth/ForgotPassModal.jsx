import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ButtonLoader from '../../../../shared/loader/ButtonLoader';
import { USER_API_URL } from '../../../../../util/API_URL';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast';

const ForgotPassModal = () => {
    const clsModal = useRef();
    const [step, setStep] = useState(1); // Steps: 1 - Email, 2 - OTP, 3 - Reset Password
    const [isLoading, setIsLoading] = useState(false);
    const [eye, setEye] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // For inline error messages
    const navigate = useNavigate();

    const handleEmailSubmit = async () => {
        setError('');
        if (!email) {
            setError('Please enter your email.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${USER_API_URL}/forgotpass/mail`, { email });
            if (response.status === 200) {
                setIsLoading(false);
                dynamicToast({ message: 'OTP has been sent to your email.', timer: 3000, icon: 'info' });
                setStep(2); // Move to OTP verification step
            }
        } catch (error) {
            setIsLoading(false);
            setError('Failed to send email. Please try again.');
        }
    };

    const handleOtpSubmit = async () => {
        setError('');
        if (!otp || otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${USER_API_URL}/forgotpass/otp`, { email, otp });
            if (response.status === 200) {
                setIsLoading(false);
                dynamicToast({ message: 'OTP verified successfully.', timer: 3000, icon: 'success' });
                setStep(3); // Move to reset password step
            }
        } catch (error) {
            setIsLoading(false);
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleResetPassword = async () => {
        setError('');
        if (!password || !confirmPassword) {
            setError('Please fill in all password fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${USER_API_URL}/forgotpass`, { email, password });
            if (response.status === 200) {
                setIsLoading(false);
                // dynamicToast({ message: 'Password reset successfully.', timer: 3000, icon: 'success' });
                localStorage.setItem('isSignin', true)
                localStorage.setItem('userToken', response.data.token)
                navigate('/'); // Redirect to sign-in page
                clsModal.current.click();
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <>
            <div
                className="modal fade"
                id="forgotPassword"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="forgotPassword"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-popup">
                        <div className="modal-body p-30">
                            <div className="pass-modal">
                                <div className="pass-header">
                                    <h4 className="font-active">Recover Your Account</h4>
                                </div>
                                <div className="pass-body my-4">
                                    {error && <small className="text-danger">{error}</small>}
                                    {step === 1 && (
                                        <div className="auth cs-border">
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                className='form-control'
                                                required
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                            />
                                        </div>
                                    )}
                                    {step === 2 && (
                                        <div className="auth  cs-border">
                                            <input
                                                onChange={(e) =>
                                                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))
                                                }
                                                className='form-control'
                                                value={otp}
                                                required
                                                name="otp"
                                                type="text"
                                                placeholder="Enter 4-digit OTP"
                                            />
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <div className="auth my-3 cs-border">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    required
                                                className='form-control'
                                                    name="password"
                                                    type={eye ? 'text' : 'password'}
                                                    placeholder="New Password"
                                                />
                                            </div>
                                            <div className="auth my-3 cs-border">
                                                <input
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    value={confirmPassword}
                                                    required
                                                className='form-control'
                                                    name="confirmPassword"
                                                    type={eye ? 'text' : 'password'}
                                                    placeholder="Confirm Password"
                                                />
                                            </div>
                                            <button
                                                    type="button"
                                                    className='btn text-primary'
                                                    onClick={() => setEye(!eye)}
                                                >
                                                    View Password
                                                </button>
                                        </>
                                    )}
                                </div>
                                <div className="pass-footer mt-4">
                                    <button
                                        type="button"
                                        className="theme-btn sm bg-idle"
                                        data-bs-dismiss="modal"
                                        ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="theme-btn sm"
                                        onClick={() => {
                                            if (step === 1) handleEmailSubmit();
                                            else if (step === 2) handleOtpSubmit();
                                            else if (step === 3) handleResetPassword();
                                        }}
                                    >
                                        {isLoading ? (
                                            <ButtonLoader props="Submitting" />
                                        ) : step === 1
                                            ? 'Send OTP'
                                            : step === 2
                                            ? 'Verify OTP'
                                            : 'Reset Password'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassModal;
