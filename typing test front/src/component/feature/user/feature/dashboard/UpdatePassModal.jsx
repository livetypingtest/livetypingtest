import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { passwordUpdateSchema } from '../../../../../schemas/UserUpdateSchema';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpdatePassword, resetState } from '../../../../../redux/UserDataSlice';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast';

const UpdatePassModal = ({ props }) => {
    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled);
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.UserDataSlice.processingMsg);
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg);

    const clsModal = useRef();
    const clrModal = useRef();

    // Initial form values based on props
    const initialValues = props === 'notEmpty' 
        ? { currentpassword: '', newpassword: '', repassword: '' } 
        : { newpassword: '', repassword: '' };

    const passwordForm = useFormik({
        validationSchema: passwordUpdateSchema(props?.props === 'notEmpty'),
        initialValues,
        enableReinitialize: true,
        onSubmit: (formData) => {
            dispatch(handleUpdatePassword(formData));
        }
    });

    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg?.type === 'updatepassword') {
                dynamicToast({ message: 'Password Updated Successfully!', icon: 'success' });
                clrModal.current.click();
                
                setTimeout(() => {
                    clsModal.current.click();
                    dispatch(resetState());
                    passwordForm.resetForm();  // Reset form fields here
                }, 10);
            }
        }
    }, [isFullfilled, dispatch, fullFillMsg]);

    return (
        <div
            className="modal fade"
            id="updatepassword"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="updatepassword"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body">
                        <div className='pass-modal'>
                            <div className='pass-header'>
                                <h4 className='font-active'>Update Password</h4>
                            </div>
                            <form onSubmit={passwordForm.handleSubmit}>
                                <button style={{ display: 'none' }} type='reset' ref={clrModal}></button>

                                <div className="pass-body my-4">
                                    {props === 'notEmpty' && (
                                        <div className='profile-input my-3'>
                                            <label htmlFor="currentpassword">Enter Current Password:</label>
                                            <input
                                                name='currentpassword'
                                                type='password'
                                                placeholder='Current Password'
                                                className='bg-input'
                                                onChange={passwordForm.handleChange}
                                                onBlur={passwordForm.handleBlur}
                                                value={passwordForm.values.currentpassword}
                                            />
                                            {passwordForm.touched.currentpassword && passwordForm.errors.currentpassword ? (
                                                <div className="error-text text-danger">{passwordForm.errors.currentpassword}</div>
                                            ) : null}
                                        </div>
                                    )}
                                    <div className='profile-input my-3'>
                                        <label htmlFor="newpassword">Enter New Password:</label>
                                        <input
                                            name='newpassword'
                                            type='password'
                                            placeholder='Enter New Password'
                                            className='bg-input'
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                            value={passwordForm.values.newpassword}
                                        />
                                        {passwordForm.touched.newpassword && passwordForm.errors.newpassword ? (
                                            <div className="error-text text-danger">{passwordForm.errors.newpassword}</div>
                                        ) : null}
                                    </div>
                                    <div className='profile-input my-3'>
                                        <label htmlFor="repassword">Confirm Password:</label>
                                        <input
                                            name='repassword'
                                            type='password'
                                            placeholder='Confirm Password'
                                            className='bg-input'
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                            value={passwordForm.values.repassword}
                                        />
                                        {passwordForm.touched.repassword && passwordForm.errors.repassword ? (
                                            <div className="error-text text-danger">{passwordForm.errors.repassword}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="pass-footer">
                                    <button
                                        type="button"
                                        className="theme-btn sm bg-idle"
                                        data-bs-dismiss="modal"
                                        ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="theme-btn sm" disabled={isProcessing}>
                                        {isProcessing && processingMsg?.type === 'updatepassword' ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassModal;
