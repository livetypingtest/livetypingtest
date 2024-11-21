import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill theme
import { dynamicToast } from '../../shared/Toast/DynamicToast';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddBlogPost, handleDeleteBlogCategory, handleEditBlogPost, resetState } from '../../../redux/AdminDataSlice';
import { useNavigate, useParams } from 'react-router-dom';
import StateCircleLoader from '../../shared/loader/StateCircleLoader';
import AddBlogCategory from './blogElements/AddBlogCategory';
import Quill from 'quill';

// Ensure the Code Block module is included
import 'quill/dist/quill.snow.css'; // import Quill's default CSS styles

// Register the CodeBlock module with Quill
const CodeBlock = Quill.import('formats/code-block');
Quill.register(CodeBlock, true);


const BlogEditor = () => {
    const [content, setContent] = useState({ content: '', title: '', description : '', category : [], status : '', tags : [], seoTitle : '', seoDescription : '', index : '', permalink: '' });
    const [imageData, setImageData] = useState();
    const featuredImage = useRef(null);
    const dispatch = useDispatch();
    const [displayData, setDisplayData] = useState([])
    const blogData = useSelector(state => state.AdminDataSlice.blog)
    const adminData = useSelector(state => state.AdminDataSlice.adminData)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg);
    const isError = useSelector(state => state.AdminDataSlice.isError);
    const errorMsg = useSelector(state => state.AdminDataSlice.errorMsg);
    const [loader, setLoader] = useState({state : false, type : ''});
    const [error, setError] = useState({state : false, type : '', message : ''})
    const navigate = useNavigate();
    const param = useParams();
    const [saveBtn, setSaveBtn] = useState('')
    const [addCategory, setAddCategory] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [blogCategory, setBlogCategory] = useState(null);
    const [tagInput, setTagInput] = useState('');

    // Handle image selection from file input
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        
        if (!file) return;

        // Check the file type for additional validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            dynamicToast({ message: 'Please upload a valid image file (jpeg, jpg, or png).', icon: 'error' });
            return;
        }

        setImageData(file);

        if (file) {
            const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    useEffect(()=>{
        if(adminData){
            setBlogCategory(adminData?.blogCategory)
        }
    }, [adminData])

    const handleCheckboxChange = (category) => {
        setContent((prevContent) => ({
            ...prevContent,
            category: prevContent.category.includes(category)
                ? prevContent.category.filter((item) => item !== category) // Remove if already selected
                : [...prevContent.category, category] // Add if not selected
        }));
    };
    
    const fetchBlogData = () => {
        if (param?.id && blogData?.length > 0) {
            const filterData = blogData.find(value => value._id === param?.id);
            
            if (filterData) {
                setContent(prevContent => ({
                    title: filterData.title || prevContent.title,
                    content: filterData.content || prevContent.content,
                    description: filterData.description || prevContent.description,
                    category: filterData.category || prevContent.category,
                    status: filterData.status || prevContent.status,
                    tags: filterData.tags || prevContent.tags,
                    index: filterData.index || prevContent.index,
                    seoDescription: filterData.seoDescription || prevContent.seoDescription,
                    seoTitle: filterData.seoTitle || prevContent.seoTitle,
                    permalink : filterData.permalink || prevContent.permalink
                }));
                setDisplayData(filterData);
            } else {
                // console.warn("No matching blog post found.");
            }
        }
    }

    useEffect(() => {
        fetchBlogData()
    }, [blogData]);

    useEffect(() => {
        setContent(prevContent => ({
            title: displayData.title || prevContent.title,
            content: displayData.content || prevContent.content,
            description: displayData.description || prevContent.description,
            category: displayData.category || prevContent.category,
            status: displayData.status || prevContent.status,
            tags: displayData.tags || prevContent.tags,
            index: displayData.index || prevContent.index,
            seoDescription: displayData.seoDescription || prevContent.seoDescription,
            seoTitle: displayData.seoTitle || prevContent.seoTitle,
            permalink : displayData.permalink || prevContent.permalink
        }));
    }, [blogData, displayData]);

    // useEffect(()=>{console.log(content)}, [])

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
        profileData.append('description', content.description);
        profileData.append('index', content.index);
        profileData.append('seoDescription', content.seoDescription);
        profileData.append('seoTitle', content.seoTitle);
        profileData.append('date', new Date());
        profileData.append('category', JSON.stringify(content.category))
        profileData.append('status', content.status)
        profileData.append('tags', JSON.stringify(content.tags))
        profileData.append('permalink', content.permalink)
    
        if(param?.id) {
            profileData.append('id', displayData?._id)
            dispatch(handleEditBlogPost(profileData))
        } else dispatch(handleAddBlogPost(profileData));

    };

    useEffect(() => {
        if(isFullfilled) {
            if (fullFillMsg?.type === 'blog') {
                setLoader({state : false, type : ''});
                dynamicToast({ message: 'Blog Posted Successfully!', icon: 'success' });
                saveBtn === 'saveExit' ? navigate('/admin/blog') : null
                dispatch(resetState());
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg]);

    useEffect(() => {
        if(isProcessing) {
            setLoader({state : true, type : processingMsg?.type});
            dispatch(resetState());
        }
    }, [isProcessing, processingMsg]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!content.tags.includes(tagInput.trim())) {
                setContent((prevContent) => ({
                    ...prevContent,
                    tags: [...prevContent.tags, tagInput.trim()]
                }));
                setTagInput('');
            }
        }
    };

    const removeTag = (index) => {
        setContent((prevContent) => ({
            ...prevContent,
            tags: prevContent.tags.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const deleteTheCategory = (value) => {
        // console.log(value)
        dispatch(handleDeleteBlogCategory(value))
    }

    const permalinkFormat = (event) => {
        const title = event.target.value;
        const permalink = title
            .toLowerCase()             // Convert the title to lowercase
            .replace(/\s+/g, "-");     // Replace spaces with hyphens (handles multiple spaces too)
    
        setContent({ 
            ...content, 
            permalink: permalink       // Update permalink in real-time
        });
    };
    

    const setTitlePermalink = (event) => {
        const title = event.target.value;
        const permalink = title
            .toLowerCase()            // Convert the title to lowercase
            .split(" ")              // Split the title into words
            .filter(word => word)    // Remove empty strings (in case of extra spaces)
            .join("-");  

        setContent({ 
            ...content, 
            title: title,    
            permalink: permalink     // Keep the original title
        });
        permalinkFormat(title)
    };
    

    return (
        <>
            <section>
                <div className="container  pb-5 pt-7">
                    <div className="row align-items-center">
                {/* <button onClick={()=>console.log(content)}>ok</button> */}
                        <div className=" col-md-9">
                            <div className="blog-main-layout p-35 custom-flex-column">
                                    <h2 className='text-center'>{param?.id ? 'Update Blog Post' : 'Create New Blog Post'}</h2>
                                <div className="blog-form-cs">
                                    <div className='my-2'>
                                        <label className='font-active' htmlFor="Title">Enter Post Title: &nbsp;</label>
                                        <input className='form-control' placeholder='Enter Your Blog Title Here' type="text" value={content.title} onChange={(event) => setTitlePermalink(event)} name="title" />
                                    </div>
                                    <div className='my-2'>
                                        <label className='font-active' htmlFor="Title">Description: &nbsp;</label>
                                        <input className='form-control' placeholder='Brief Description of Your Blog' type="text" value={content.description} onChange={(event) => setContent({ ...content, description: event.target.value })} name="title" />
                                    </div>
                                </div>
                                <div className="blog-editor p-0 m-0">
                                    <ReactQuill
                                        value={content.content}
                                        onChange={handleContentChange}
                                        placeholder="Write your blog post here..."
                                        modules={modules}
                                        formats={formats}
                                    />
                                </div>
                            </div>
                            <div className="blog-main-layout p-35 my-4">
                                <h4 className='m-0'>Search Engine Optimisation</h4>
                                <div className="blog-form-cs">
                                    <div className='my-2'>
                                        <label className='font-active' htmlFor="Title">SEO Title &nbsp;</label>
                                        <input className='form-control' placeholder='Enter Your Blog Title Here' type="text" value={content.seoTitle} onChange={(event) => setContent({ ...content, seoTitle: event.target.value })} name="seoTitle" />
                                    </div>
                                    <div className='my-2'>
                                        <label className='font-active' htmlFor="Title">SEO Description: &nbsp;</label>
                                        <input className='form-control' placeholder='Brief Description of Your Blog' type="text" value={content.seoDescription} onChange={(event) => setContent({ ...content, seoDescription: event.target.value })} name="seoDescription" />
                                    </div>
                                    <div className='my-2'>
                                        <label className='font-active' htmlFor="Title">Index : &nbsp;</label>
                                        <div className='seo-index-radio'>
                                            <div className="form-check w-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="exampleRadios"
                                                    id="exampleRadios1"
                                                    value="index"
                                                    checked={content.index === "index"}
                                                    onChange={() => setContent({ ...content, index: "index" })}
                                                />
                                                <label className="form-check-label" htmlFor="exampleRadios1">
                                                    Index
                                                </label>
                                            </div>
                                            <div className="form-check w-auto">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="exampleRadios"
                                                    id="exampleRadios2"
                                                    value="noindex"
                                                    checked={content.index === "noindex"}
                                                    onChange={() => setContent({ ...content, index: "noindex" })}
                                                />
                                                <label className="form-check-label" htmlFor="exampleRadios2">
                                                    No Index
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="blog-side-layout">
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Publish
                                    </div>
                                    <div className="publish-btn py-3">
                                        <button className='btn btn-primary' onClick={()=>{handleSave(), setSaveBtn('save')}}>Save Post</button>
                                        <button className='btn btn-primary' onClick={()=>{handleSave(), setSaveBtn('saveExit')}}>Save & Exit</button>
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Permalink
                                    </div>
                                    <input type='text' value={content?.permalink} placeholder='Edit Permalink' onChange={(event)=> permalinkFormat(event)} className='form-control' />
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Status
                                    </div>
                                    <select
                                        className="select2 my-3 form-control custom-select select2-hidden-accessible"
                                        onChange={(event)=>setContent({...content, status : event.target.value})}
                                        value={content?.status}
                                        data-select2-id="select2-data-7-idkc"
                                        tabIndex={-1}
                                        aria-hidden="true"
                                    >
                                        <option data-select2-id="select2-data-9-7ovj">Select</option>
                                        <option data-select2-id="select2-data-9-7ovj">Published</option>
                                        <option data-select2-id="select2-data-9-7ovj">Draft</option>
                                        <option data-select2-id="select2-data-9-7ovj">Pending</option>
                                    </select>
                                    
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        category
                                    </div>
                                    <div className="show-category">
                                        <div className="blog-category">
                                            {blogCategory?.length !== 0 ? (
                                                blogCategory?.map((value, index) => (
                                                    <div key={index} className="form-check cs-blog-category">
                                                        <div>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`category-${index}`}
                                                                checked={content?.category?.includes(value)}
                                                                onChange={() => handleCheckboxChange(value)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`category-${index}`}>
                                                                {value}
                                                            </label>
                                                        </div>
                                                        <button onClick={()=>deleteTheCategory(value)} className='btn'><i class="fa-solid fa-xmark text-danger"></i></button>
                                                    </div>
                                                ))
                                            ) : (
                                                "No Category Added"
                                            )}
                                        </div>
                                    </div>
                                    <div className="add-category">
                                        <button onClick={()=>setAddCategory(!addCategory)} className='btn text-info'>+ Add Category</button>
                                        {
                                            addCategory ? (
                                                <AddBlogCategory />
                                            ) : null
                                        }
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Image
                                    </div>
                                    <div className='blog-img-container my-3' onClick={()=>featuredImage?.current?.click()}>
                                        {imagePreview ? (
                                            <img className='blog-image' src={imagePreview} alt="Preview" />
                                        ) : param?.id ? (
                                            <img className='blog-image' src={`${displayData?.featuredImage?.path}`} alt="Preview" />
                                        ) : null}
                                    </div>
                                    <input
                                        type="file"
                                        ref={featuredImage}
                                        onChange={handleImageChange}
                                        style={{display : "none"}}
                                    />
                                    <div className='' >
                                        <label className=' text-primary' htmlFor="fileInput" >
                                        Choose image
                                        </label>
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Tags
                                    </div>
                                    <div className="tag-input-container">
                                        <div className="tag-list" onClick={() => document.getElementById('hidden-input').focus()}>
                                            {content?.tags?.map((tag, index) => (
                                                <div key={index} className="tag-item">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(index)}>✕</button>
                                                </div>
                                            ))}
                                            <input
                                                id="hidden-input"
                                                type="text"
                                                value={tagInput}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                                className="hidden-input"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {loader?.state && loader?.type === 'blog' && <StateCircleLoader />}
        </>
    );
};

const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'], // Add 'code-block' to toolbar
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'], // remove formatting
    ],
  };

  const formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
    'strike', 'blockquote', 'code-block', 'color', 'background',
    'align', 'link', 'image', 'video',
  ];

export default BlogEditor;
