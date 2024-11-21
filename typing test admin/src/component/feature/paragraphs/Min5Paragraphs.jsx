import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import AddParagraphsSchema from '../../../schemas/AddParagraphsSchema';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddParagraphs, handleDeleteParagraph, resetState } from '../../../redux/AdminDataSlice';
import ButtonLoader from '../../shared/loader/ButtonLoader';

const Min5Paragraphs = (props) => {
    const textareaRef = useRef([]);
    const [textareas, setTextareas] = useState([{ id: Date.now(), para: '' }]);
    const [displayData, setDisplayData] = useState([]);
    const [editableIndex, setEditableIndex] = useState(null);
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled)
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing)
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg)
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg)
    const { paragraphs, levelFilter, timeFilter, isfullFilled } = props?.props;

    const handleInput = (textarea) => {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        switch (levelFilter) {
            case 'easy':
                setDisplayData(paragraphs?.easy);
                break;
            case 'medium':
                setDisplayData(paragraphs?.medium);
                break;
            case 'hard':
                setDisplayData(paragraphs?.hard);
                break;
            default:
                setDisplayData([]);
        }
    }, [paragraphs, levelFilter]);

    const addParaForm = useFormik({
        initialValues: {
            paragraphs: textareas,
            level: '',
            time: ''
        },
        validationSchema: AddParagraphsSchema,
        onSubmit: (formData) => {
            formData.level = levelFilter;
            formData.time = timeFilter;
            dispatch(handleAddParagraphs(formData));
            setTextareas([{ id: Date.now(), para: '' }]); // Clear after adding
        },
    });

    const UpdateParaForm = useFormik({
        initialValues: displayData?.reduce((acc, curr) => {
            acc[curr.id] = curr.para;
            return acc;
        }, {}),
        onSubmit: (values) => {
            const updatedData = displayData.map(item => ({
                ...item,
                para: values[item.id],
            }));
            const formData = {
                paragraphs : updatedData,
                level : levelFilter,
                time : timeFilter
            }
            setDisplayData(updatedData);
            setEditableIndex(null); // Reset editable index after submission
            dispatch(handleAddParagraphs(formData))
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        UpdateParaForm.setValues(displayData?.reduce((acc, curr) => {
            acc[curr.id] = curr.para;
            return acc;
        }, {}));
    }, [displayData]);

    useEffect(() => {
        if (isfullFilled) {
            if(fullFillMsg?.type === 'addpara') {
                setTextareas([{ id: Date.now(), para: '' }]);
                addParaForm.resetForm();
            }
        }
    }, [isfullFilled, fullFillMsg]);

    const handleAddMore = () => {
        setTextareas((prev) => [...prev, { id: Date.now(), para: '' }]);
    };

    const handleDeleteLast = () => {
        if (textareas.length > 1) {
            setTextareas((prev) => prev.slice(0, -1));
        }
    };

    const handleEditToggle = (index) => {
        setEditableIndex((prev) => (prev === index ? null : index)); // Toggle edit mode
    };

    const handleDelete = (id) => {
        const obj = {
            id : id,
            level : levelFilter,
            time : timeFilter
        }
        dispatch(handleDeleteParagraph(obj))
    };

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'deletepara') {
                setLoader(false)
                dispatch(resetState())
            }
        }
    }, [isFullfilled, fullFillMsg])
    
    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'deletepara') {
                setLoader(true)
                dispatch(resetState())
            }
        }
    }, [isProcessing, processingMsg])

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'addpara') {
                setLoader(false)
                dispatch(resetState())
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'addpara') {
                setLoader(true)
                dispatch(resetState())
            }
        }
    }, [isProcessing, processingMsg])

    return (
        <>
            <section>
                <div className="container py-4">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="para-layout">
                                <h2 className='font-active word-space-5 text-left'>Set Paragraphs For {timeFilter} Min {levelFilter} Mode</h2>
                                {displayData?.map((value, index) => (
                                    <>
                                        <h4 className='m-0'>{`Paragraph ${index+1}`}</h4>
                                        <form className='display-para-sec' onSubmit={UpdateParaForm.handleSubmit}>
                                            <div className="add-para" key={index}>
                                                <textarea
                                                    className="para-writer"
                                                    // readOnly={editableIndex !== index}
                                                    disabled={editableIndex !== index}
                                                    name={value.id}
                                                    onChange={UpdateParaForm.handleChange}
                                                    value={UpdateParaForm.values[value.id] || ''}
                                                />
                                            </div>
                                            <div className='para-btns'>
                                            {editableIndex === index ? (
                                                <button type='submit' className='btn btn-primary'>
                                                    <i className="fa-solid fa-check fa-lg" style={{ color: "#fff" }} />
                                                </button>
                                            ) : (
                                                <button
                                                    type='button' // Ensure the button type is 'button'
                                                    className='btn btn-primary '
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent default form submission
                                                        handleEditToggle(index); // Toggle edit mode
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen fa-md" style={{ color: "#fff" }} />
                                                </button>
                                            )}
                                                <button type='button' className='btn btn-primary' onClick={() => handleDelete(value.id)}>
                                                    <i className="fa-solid fa-trash fa-md" style={{ color: "#fff" }} />
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ))}
                                <h4 className='m-0'>Add New Paragraph</h4>
                                <form className='form' onSubmit={addParaForm.handleSubmit}>
                                    {textareas.map((textarea, index) => (
                                        <>
                                        <div className="add-para" key={textarea.id}>
                                            <textarea
                                                ref={(el) => (textareaRef.current[index] = el)}
                                                name={`paragraphs[${index}].para`}
                                                className="para-writer"
                                                onInput={(e) => handleInput(e.target)}
                                                onChange={(e) => {
                                                    const newTextareas = [...textareas];
                                                    newTextareas[index].para = e.target.value;
                                                    setTextareas(newTextareas);
                                                    addParaForm.setFieldValue(`paragraphs[${index}].para`, e.target.value);
                                                }}
                                                placeholder="Set a Paragraph..."
                                                value={textarea.para}
                                            />
                                        </div>
                                            {addParaForm.errors.paragraphs && addParaForm.errors.paragraphs[index]?.para && (
                                                <div className="error text-danger">{addParaForm.errors.paragraphs[index].para}</div>
                                            )}
                                        </>
                                    ))}
                                    <div className='add-more-para'>
                                        <button type='submit' className='btn btn-primary'>{loader ? (<ButtonLoader props={'Uploading Paragraph'} />) : 'Upload Paragraph'}</button>
                                        <div>
                                            <button type='button' className='theme-btn' onClick={handleDeleteLast}>
                                                <i className="fa-solid fa-trash-can fa-lg" style={{ color: "#d41111" }} />
                                                &nbsp; {window.innerWidth <= 767 ? "" : "Delete"}
                                            </button>
                                            <button type='button' className='theme-btn' onClick={handleAddMore}>
                                                <i className="fa-solid fa-plus-large fa-lg" style={{ color: "#71cac7" }} />
                                                &nbsp; {window.innerWidth <= 767 ? "" : "Add More"}
                                            </button>
                                        </div>
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

export default Min5Paragraphs;
