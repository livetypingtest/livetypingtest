import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { passwordUpdateSchema } from '../../../../schemas/UserUpdateSchema';
import { resetState, handleUpdatePassword } from '../../../../redux/AdminDataSlice';
import { dynamicToast } from '../../../shared/Toast/DynamicToast';

const UpdatePassModal = ({ props }) => {

    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);

    const clsModal = useRef();
    const clrModal = useRef();

    // Initial form values based on props
    const initialValues = { newpassword: '', repassword: '', username : props?.username };

    const passwordForm = useFormik({
        validationSchema: passwordUpdateSchema(props?.state === 'notEmpty'),
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
                                    <div className='profile-input my-3'>
                                        <label htmlFor="newpassword">Enter New Password:</label>
                                        <input
                                            name='newpassword'
                                            type='password'
                                            placeholder='Enter New Password'
                                            className='form-control my-2'
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
                                            className='form-control my-2'
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
                                        className="btn"
                                        data-bs-dismiss="modal"
                                        ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-info" disabled={isProcessing}>
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
