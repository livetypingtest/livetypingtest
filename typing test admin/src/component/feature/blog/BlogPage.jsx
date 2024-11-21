import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { dynamicToast } from "../../shared/Toast/DynamicToast";
import DeleteBlogModal from "./modal/DeleteBlogModal";
 import Pagination from '../../shared/pagination/Pagination'
import axios from "axios";
import { ADMIN_API_URL } from "../../../util/API_URL";
import { handleAddBlogPostToState } from "../../../redux/AdminDataSlice";


const BlogPage = () => {

    const [getBlogId, setGetBlogId] = useState()
    const [blogs, setBlogs] = useState([]);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const fetchBlogs = async (page) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${ADMIN_API_URL}/blog?page=${page}&limit=${blogsPerPage}`);
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

    const totalPages = Math.ceil(totalBlogs / blogsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
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
                                <table className="table table-hover m-0 table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Blog Title</th>
                                            <th>Posted On</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogs && blogs.map((value, index) => {

                                            const rawDate = value.createdat;
                                            let formattedDate
                                                    
                                            // Check if the rawDate is valid and then parse it
                                            const parsedDate = new Date(rawDate);
                                            
                                            if (!isNaN(parsedDate)) {
                                                // Format the valid date to '04 Oct 2024' format
                                                formattedDate = new Intl.DateTimeFormat('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }).format(parsedDate)
                                            } else {
                                                console.error('Invalid date format:', rawDate);
                                            }

                                            return(
                                            <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}>{value.title}</NavLink></td>
                                                    <td><NavLink className='btn' to={`/admin/blog/${value.permalink}`}>{formattedDate}</NavLink></td>
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
