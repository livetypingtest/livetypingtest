import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill theme
import { useEffect, useState } from 'react';
import { handlePostTermData, handlePostPrivacyData, resetState } from '../../../redux/DynamicPagesDataSlice';

const Editor = () => {
    const { page } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rawData = useSelector(state => state.DynamicPagesDataSlice?.[page]);
    const isProcessing = useSelector(state => state.DynamicPagesDataSlice.isProcessing);
    const isFullfilled = useSelector(state => state.DynamicPagesDataSlice.isFullfilled);

    const [content, setContent] = useState({ content: '', title: '' });
    const [loader, setLoader] = useState(false);

    // Redirect if the page is not 'term' or 'privacy'
    useEffect(() => {
        if (page !== 'term' && page !== 'privacy') {
            navigate('/admin/pages');
        }
    }, [page, navigate]);

    // Set page data if it exists
    useEffect(() => {
        if (rawData) {
            setContent({
                content: rawData.content || '',
                title: rawData.title || ''
            });
        }
    }, [rawData]);

    // Handle save functionality
    const handleSave = () => {
        const data = {
            content: content.content,
            title: content.title,
            date: new Date()
        };

        if (page === 'term') {
            dispatch(handlePostTermData(data));
        } else {
            dispatch(handlePostPrivacyData(data));
        }
    };

    // Update content on editor change
    const handleContentChange = (value) => {
        setContent(prevContent => ({ ...prevContent, content: value }));
    };

    // Monitor processing and fulfillment states
    useEffect(() => {
        if (isProcessing) {
            setLoader(true);
        } else if (isFullfilled) {
            setLoader(false);
            navigate('/admin/pages');
        }

        return () => {
            // Reset state on component unmount
            dispatch(resetState());
        };
    }, [isProcessing, isFullfilled, navigate, dispatch]);

    return (
        <section>
            <div className="container pt-7 pb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-main-layout">
                            <h2 className="text-center">
                                {page === 'term' ? 'Manage Terms & Conditions' : 'Manage Privacy & Policy'}
                            </h2>
                            <div className="blog-form-cs">
                                <div className="my-3">
                                    <label className="font-active" htmlFor="Title">Enter Post Title:</label>
                                    <input
                                        className="form-control"
                                        placeholder="Enter Your Blog Title Here"
                                        type="text"
                                        value={content.title}
                                        onChange={(event) =>
                                            setContent(prevContent => ({ ...prevContent, title: event.target.value }))
                                        }
                                        name="title"
                                    />
                                </div>
                            </div>
                            <div className="blog-editor p-0">
                                <ReactQuill
                                    value={content.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog post here..."
                                    modules={Editor.modules}
                                    formats={Editor.formats}
                                />
                            </div>
                            <div className=" mt-3">
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Save Post {loader && <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#fff" }} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Editor;

// Quill Editor Modules and Formats (optional: define outside the component for better readability)
Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background'
];
