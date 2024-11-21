import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { passwordUpdateSchema } from '../../../schemas/UserUpdateSchema';
import { dynamicToast } from '../../shared/Toast/DynamicToast';
import axios from 'axios'
import { ADMIN_API_URL } from '../../../util/API_URL'

const UpdatePassModal = ({ props }) => {

    const clsModal = useRef();
    const clrModal = useRef();
    const [isProcessing, setIsProcessing] = useState(false)

    // Initial form values based on props
    const initialValues = props === 'notEmpty' 
        ? { currentpassword: '', newpassword: '', repassword: '' } 
        : { newpassword: '', repassword: '' };

    const passwordForm = useFormik({
        validationSchema: passwordUpdateSchema(props?.props === 'notEmpty'),
        initialValues,
        enableReinitialize: true,
        onSubmit: async(formData) => {
            setIsProcessing(true)
            const ID = localStorage.getItem('adminToken')
            const response = await axios.put(`${ADMIN_API_URL}`, formData, { headers : { Authorization : ID } })
            console.log(response.data)
            if(response.data.status === 200) {
                dynamicToast({ message: 'Password Updated Successfully!', icon: 'success' });
                setIsProcessing(false)
                clrModal.current.click();
                
                setTimeout(() => {
                    clsModal.current.click();
                    passwordForm.resetForm();  // Reset form fields here
                }, 10);
            }
        }
    });

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
                                                className='form-control'
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
                                            className='form-control'
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
                                            className='form-control'
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
                                        className="btn "
                                        data-bs-dismiss="modal"
                                        ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                                        {isProcessing  ? "Updating..." : "Update"}
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
