import React from 'react';
import { useFormik } from 'formik';

const DisplayDataForm = ({ displayData, setDisplayData, editableIndex, setEditableIndex }) => {
    const formik = useFormik({
        initialValues: displayData,
        onSubmit: (values) => {
            setDisplayData(values);
            setEditableIndex(null);
        },
    });

    const handleEditToggle = (index) => {
        setEditableIndex(index === editableIndex ? null : index);
    };

    const handleChange = (index, event) => {
        const { value } = event.target;
        const updatedData = [...formik.values];
        updatedData[index].para = value;
        formik.setValues(updatedData);
    };

    const handleDelete = (index) => {
        const updatedData = formik.values.filter((_, i) => i !== index);
        formik.setValues(updatedData);
        setDisplayData(updatedData); // Ensure displayData state is updated
    };

    return (
        <>
            {formik.values && formik.values.map((value, index) => (
                <div className="add-para" key={value.id}>
                    <textarea
                        className="para-writer"
                        readOnly={editableIndex !== index}
                        value={value.para}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <div className='para-btns'>
                        {editableIndex === index ? (
                            <button type="button" className='btn btn-primary' onClick={formik.handleSubmit}>
                                <i className="fa-solid fa-check fa-lg" style={{ color: "#71cac7" }} />
                            </button>
                        ) : (
                            <button type="button" className='btn btn-success' onClick={() => handleEditToggle(index)}>
                                <i className="fa-solid fa-pen fa-lg" style={{ color: "#71cac7" }} />
                            </button>
                        )}
                        <button type="button" className='btn btn-danger' onClick={() => handleDelete(index)}>
                            <i className="fa-solid fa-trash fa-lg" style={{ color: "#71cac7" }} />
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};

export default DisplayDataForm;
