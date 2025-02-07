import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { dynamicToast } from "../../shared/Toast/DynamicToast";
import DeleteBlogModal from "./modal/DeleteBlogModal";
import Pagination from '../../shared/pagination/Pagination'
import axios from "axios";
import { ADMIN_API_URL } from "../../../util/API_URL";
import { handleAddBlogPostToState } from "../../../redux/AdminDataSlice";
import DynamicTitle from "../../shared/helmet/DynamicTitle";
import { formatDate } from "../../../util/formatDate";

const BlogPage = () => {

    const dispatch = useDispatch();

    const adminData = useSelector(state => state.AdminDataSlice.adminData)
    const blogCategory = adminData?.blogCategory


    const [getBlogId, setGetBlogId] = useState()
    const [blogs, setBlogs] = useState([]);
    const [category, setCategory] = useState('all')
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage, category]);

    const fetchBlogs = async (page) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${ADMIN_API_URL}/blog?page=${page}&limit=${blogsPerPage}&category=${category}`);
            if(response.data.status === 200){
                dispatch(handleAddBlogPostToState(response.data.data))
                setBlogs(response.data.data);
                setTotalBlogs(response.data.totalBlogs);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // let sortedData;
        // sortedData = [...blogs].sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
        // setBlogs(sortedData);
        // console.log(blogs)
    }, [category]);

    // useEffect(() => {
    //     let sortedData;
    //     sortedData = [...blogs].sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
    //     setBlogs(sortedData);
    //     // if (category === 'all') {
    //     // } else {
    //     //     sortedData = blogs
    //     //         ?.filter(value => value.category?.includes(category))
    //     //         .sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
    //     //     setBlogs(sortedData);
    //     // }
    // }, [blogs]);


    const totalPages = Math.ceil(totalBlogs / blogsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <DynamicTitle title={"Live Typing Test | Blog"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Blog"}  />
            <section>
                <div className="container pt-7">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-between">
                                <h3 className="font-active">View/Edit Our Blogs</h3>
                                {
                                    isLoading && (
                                        <div className="rl-loading-container">
                                            <div className="rl-loading-thumb rl-loading-thumb-1"></div>
                                            <div className="rl-loading-thumb rl-loading-thumb-2"></div>
                                            <div className="rl-loading-thumb rl-loading-thumb-3"></div>
                                        </div>
                                    )
                                }
                                <NavLink to="/admin/blog-add" className="btn btn-primary btn-md">
                                    Add Blog &nbsp; <i className="fa-duotone fa-solid fa-plus fa-lg" style={{color : "#000"}}></i>
                                </NavLink>
                            </div>
                            
                        </div>
                        <div className="col-md-12 mt-5">
                            <div className="leaderboard-table my-3">
                                {/* <div className="select-container">
                                    <select onChange={(event)=>setCategory(event.target.value)} className="form-control">
                                        <option value='all'>Select Category</option>
                                        {blogCategory?.length !== 0 && blogCategory?.map((value, index) => (
                                            <option value={value} key={index}>{value}</option>
                                        ))}
                                    </select>
                                </div> */}
                                <table className="table table-hover m-0 table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Blog Title</th>
                                            <th>Category</th>
                                            <th>Last Updated</th>
                                            <th>Posted On</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogs && blogs.map((value, index) => {

                                            return(
                                            <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}>{value.title}</NavLink></td>
                                                    <td>{value.category?.map((value, index, array) => {
                                                        return (
                                                            <span key={index} className="text-primary">
                                                                {value}{index < array.length - 1 ? ', ' : ''}
                                                            </span>
                                                        )
                                                    })}</td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}>{formatDate(value.updatedat)}</NavLink></td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}>{formatDate(value.createdat)}</NavLink></td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}><span className={`mb-1 badge rounded-pill ${value.status === 'Published' ? 'bg-primary' : value.status === 'Draft' ? 'bg-warning' : 'bg-success'}`}>{value.status}</span></NavLink></td>
                                                    <td><NavLink className='btn' to={`/admin/blog-add/${value._id}`}><i className="fa-regular  fa-pen-to-square fa-lg"></i></NavLink></td>
                                                    <td><button className="btn" onClick={()=>setGetBlogId(value._id)} data-bs-toggle="modal" data-bs-target="#deleteblog"><i class="fa-solid fa-trash fa-lg"></i></button></td>
                                                </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                        </div>
                    </div>
                </div>
            </section>
            <DeleteBlogModal props={getBlogId} />
        </>
    );
};

export default BlogPage;
