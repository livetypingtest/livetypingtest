import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill theme
import Header from '../../../../shared/header/Header';
import Footer from '../../../../shared/footer/Footer';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddBlogPost, handleEditBlogPost, resetState } from '../../../../../redux/AdminDataSlice';
import { useNavigate, useParams } from 'react-router-dom';
import StateCircleLoader from '../../../../shared/loader/StateCircleLoader';
import { BASE_API_URL } from '../../../../../util/API_URL';

const BlogEditor = () => {
    const [content, setContent] = useState({ content: '', title: '' });
    const [imageData, setImageData] = useState();
    const featuredImage = useRef(null);
    const dispatch = useDispatch();
    const [displayData, setDisplayData] = useState([])
    const blogData = useSelector(state => state.AdminDataSlice.blog)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const param = useParams();

    useEffect(()=>{
        if(param?.id) {
            if(blogData) {
                const filterData = blogData?.filter(value => value._id === param?.id)
                setDisplayData(filterData[0])
                setContent({
                    title : filterData[0]?.title,
                    content : filterData[0]?.content
                })
            }
        }
    }, [blogData])

    const handleContentChange = (value) => {
        setContent({ ...content, content: value });
    };

    const handleSave = () => {
        // Prepare the file for upload
        const profileData = new FormData();
        if(imageData) {
            profileData.append('featuredImage', imageData);
        }
        profileData.append('title', content.title);
        profileData.append('content', content.content);
        profileData.append('date', new Date());
    
        if(param?.id) {
            profileData.append('id', displayData?._id)
            dispatch(handleEditBlogPost(profileData))
        } else dispatch(handleAddBlogPost(profileData));

    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Check the file type for additional validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            dynamicToast({ message: 'Please upload a valid image file (jpeg, jpg, or png).', icon: 'error' });
            return;
        }

        setImageData(file);
    };

    useEffect(() => {
        if (isFullfilled && fullFillMsg?.type === 'blog') {
            setLoader(false);
            localStorage.setItem('blogPosted', true);
            navigate('/admin/blog');
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg]);

    useEffect(() => {
        if (isProcessing && processingMsg?.type === 'blog') {
            setLoader(true);
            dispatch(resetState());
        }
    }, [isProcessing, processingMsg]);

    return (
        <>
            <Header />
            <section>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="offset-md-2 col-md-8">
                            <div className="blog-form-cs my-3">
                                <div className='my-4'>
                                    <label className='font-active' htmlFor="Title">Post Featured Image: &nbsp;</label>
                                    {
                                        param?.id ? (
                                            <>
                                            <div className="featured-image-layout"><img src={`${BASE_API_URL}/uploads/featuredImage/${displayData?.featuredImage?.name}`} alt="" /><button onClick={()=>featuredImage?.current?.click()}><i class="fa-duotone fa-solid fa-cloud-arrow-up text-active fa-2xl"></i></button></div>
                                            
                                            </>
                                        ) : null
                                    }
                                    <input type="file" ref={featuredImage} onChange={handleFileChange} style={param?.id ? {display : 'none'} : null} name="featured-image" />
                                </div>
                                <div className='my-3'>
                                    <label className='font-active' htmlFor="Title">Enter Post Title: &nbsp;</label>
                                    <input type="text" value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} name="title" />
                                </div>
                            </div>
                            <div className="blog-editor my-4">
                                <h2 className='header'>{param?.id ? 'Update Blog Post' : 'Create New Blog Post'}</h2>
                                <ReactQuill
                                    value={content.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog post here..."
                                    modules={BlogEditor.modules}
                                    formats={BlogEditor.formats}
                                />
                                <button onClick={handleSave}>Save Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            {loader && <StateCircleLoader />}
        </>
    );
};

// Optional: Customize toolbar options
BlogEditor.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'], // remove formatting
    ],
};

BlogEditor.formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
    'strike', 'blockquote', 'code-block', 'color', 'background',
    'align', 'link', 'image', 'video',
];

export default BlogEditor;
