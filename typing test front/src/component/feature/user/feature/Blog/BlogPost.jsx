import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { BASE_API_URL } from "../../../../../util/API_URL"

const BlogPost = (props) => {
  
  const {title, createdat, featuredImage, permalink, description} = props?.props
  const isToken = localStorage.getItem('userToken')
  const [formattedDate, setFormattedDate] = useState();


    useEffect(() => {
      if (createdat) {
        // Try converting the date string to a JavaScript Date object
        const rawDate = createdat;
        
        // Check if the rawDate is valid and then parse it
          const parsedDate = new Date(rawDate);
          
          if (!isNaN(parsedDate)) {
            // Format the valid date to '04 Oct 2024' format
            setFormattedDate(
              new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(parsedDate)
            );
          } else {
            console.error('Invalid date format:', rawDate);
          }
        }
      }, [props]);

  return (
    <>
        <div className="blog-post my-3">
            <div className="blog-img"><NavLink to={`${isToken ? '/' : '/'}blog/${permalink}`}><img src={`${featuredImage?.path}`} alt="" /></NavLink></div>
            <div className="blog-content">
                <NavLink className="text-dec-none" to={`${isToken ? '/' : '/'}blog/${permalink}`}><h1 >{title}</h1></NavLink>
                <p>{description.length > 100 ? description.slice(0, 100) + "..." : description}</p>
            </div>
            <NavLink to={`${isToken ? '/' : '/'}blog/${permalink}`}>Read More...</NavLink>
        </div>
    </>
  )
}

export default BlogPost