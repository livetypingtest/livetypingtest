import Header from "../../../../shared/header/Header"
import Footer from "../../../../shared/footer/Footer"
import { NavLink } from "react-router-dom"
import BlogPost from "./BlogPost"
import {useSelector} from 'react-redux'
import { useState } from "react"
import { useEffect } from "react"


const Blog = () => {

    const blogData = useSelector(state => state.UserDataSlice.blog)
    const blogCategory = useSelector(state => state.UserDataSlice.blogCategory)

    const [displayData, setDisplayData] = useState([])
    const [category, setCategory] = useState('all')
    
    useEffect(() => {
        if (category === 'all') {
            setDisplayData(blogData);
        } else {
            setDisplayData(blogData?.filter(value => value.category?.includes(category)));
        }
    }, [category, blogData, blogCategory]);
    



  return (
    <>
        <Header />

        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-main-header">
                            <h1 className="font-active m-0 text-left">{category === 'all' ? 'Blog' : `${category}`}</h1>
                            <div className="select-container">
                                <select onChange={(event)=>setCategory(event.target.value)} className="form-control">
                                    <option value='all'>Select Category</option>
                                    {blogCategory?.length !== 0 && blogCategory.map((value, index) => (
                                        <option value={value} key={index}>{value}</option>
                                    ))}
                                </select>
                                <span className="arrow"><i className="fa-solid fa-angle-down fa-sm" style={{ color: "#71cac7" }} /></span>
                            </div>
                        </div>
                        <div className="blog-layout mt-5">
                            {
                                displayData?.length !== 0 ? displayData?.map(value => <BlogPost props={value} />) : (<h5 className="text-light">No Blogs Found</h5>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  )
}

export default Blog