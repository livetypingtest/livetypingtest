import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetNotice, handleNoticeStatus, handlePostNotice } from '../../../redux/DynamicPagesDataSlice';
import { dynamicToast } from '../../shared/Toast/DynamicToast';
import axios from 'axios';
import { BASE_API_URL } from '../../../util/API_URL';

const Notice = () => {
    const dispatch = useDispatch();
    const notice = useSelector((state) => state.DynamicPagesDataSlice.notice);
    const isFullfilled = useSelector((state) => state.DynamicPagesDataSlice.isFullfilled);
    const fullFillMsg = useSelector((state) => state.DynamicPagesDataSlice.fullFillMsg);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch notice on component mount
        dispatch(handleGetNotice());
    }, [dispatch]);

    useEffect(() => {
        // Populate form fields and switch state when notice data is available
        if (notice) {
            formik.setValues({
                title: notice.title || '',
                description: notice.description || '',
                createdat: notice.createdat || Date.now(),
                state: notice.state || false,
            });
            setIsSwitchOn(notice.state || false);
        }
    }, [notice]);

    const handleSwitchToggle = () => {
        const newState = !isSwitchOn;
        setIsSwitchOn(newState);
        dispatch(handleNoticeStatus(newState)); // Dispatch state toggle action
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            createdat: Date.now(),
            state: false,
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required('Title is required')
                .max(50, 'Title must be 50 characters or less'),
            description: Yup.string()
                .required('Description is required')
                .max(200, 'Description must be 200 characters or less'),
        }),
        onSubmit: async(formData) => {
            setLoading(true);
            formData.createdat = new Date();
            const response = await axios.post(`${BASE_API_URL}/notice`, formData)
            if(response.data.status === 200) {
                setLoading(false);
                dispatch(handlePostNotice(formData));
                dynamicToast({ message: 'Notice Added Successfully!', timer: 3000, icon: 'success' });
            }
        },
    });

    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg?.type === 'notice-status') {
                dynamicToast({ message: 'Notice Toggeled Successfully!', timer: 3000, icon: 'success' });
            }
        }
    }, [isFullfilled, fullFillMsg]);

    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card bg-theme">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4>Set Announcement</h4>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="toggleSwitch"
                                            checked={isSwitchOn}
                                            onChange={handleSwitchToggle}
                                        />
                                        <label className="form-check-label" htmlFor="toggleSwitch">
                                            {isSwitchOn ? 'On' : 'Off'}
                                        </label>
                                    </div>
                                </div>

                                <form onSubmit={formik.handleSubmit}>
                                    <div className="card-body">
                                        {/* Title */}
                                        <div className="my-3">
                                            <label htmlFor="title">Title</label>
                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    formik.touched.title && formik.errors.title
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="Enter title"
                                                name="title"
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.title && formik.errors.title && (
                                                <div className="text-danger invalid-feedback">
                                                    {formik.errors.title}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="my-3">
                                            <label htmlFor="description">Description</label>
                                            <textarea
                                                className={`form-control ${
                                                    formik.touched.description &&
                                                    formik.errors.description
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="Enter description"
                                                name="description"
                                                rows="3"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            ></textarea>
                                            {formik.touched.description &&
                                                formik.errors.description && (
                                                    <div className="text-danger invalid-feedback">
                                                        {formik.errors.description}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <div className="card-footer text-start">
                                        {/* Submit Button */}
                                        <button type="submit" className="btn btn-primary">
                                            {loading ? 'Submitting...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Notice;
