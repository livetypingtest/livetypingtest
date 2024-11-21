import { useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../util/API_URL";
import {Helmet} from 'react-helmet'
import { marked } from "marked";


const BlogView = () => {

    const param = useParams();
    const blogData = useSelector(state => state.AdminDataSlice.blog)
    const [displayData, setDisplayData] = useState([])
    const [formattedDate, setFormattedDate] = useState();
 
    useEffect(()=>{
        if(blogData) {
            const filteredData = blogData?.filter(value => value.permalink === param?.id)
            setDisplayData(filteredData[0])
        }
    }, [blogData, param.id])

    useEffect(() => {
        if (displayData?.createdat) {
          // Try converting the date string to a JavaScript Date object
          const rawDate = displayData.createdat;
          
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
          // console.log('Invalid date format:', displayData); 
        }, [displayData]);

        const processQuillContent = (html) => {
          if (!html) return ""; // Handle empty or null HTML gracefully
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
      
          // Handle code blocks without escaping their content
          doc.querySelectorAll("pre.ql-syntax").forEach((block) => {
              // Allow the content inside <pre> to remain raw for display
              block.innerHTML = block.textContent; // Keeps code formatting intact
          });
      
          return doc.body.innerHTML; // Return the processed HTML
      };
      
      

  return (
    <>
      <Helmet>
        {/* Set the page title */}
        <title>{displayData.seoTitle || 'Default Title'}</title>
        {/* Meta description for SEO */}
        <meta name="description" content={displayData.seoDescription || 'Default Description'} />
        {/* Open Graph tags for social media */}
        <meta property="og:title" content={displayData.seoTitle || 'Default Title'} />
        <meta property="og:description" content={displayData.seoDescription || 'Default Description'} />
        <meta property="og:image" content={displayData?.featuredImage?.path || '/default-image.jpg'} />
        <link rel="icon" href={displayData?.featuredImage?.path || '/default-favicon.ico'} />
        </Helmet>
        <section>
            <div className="container pt-7">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-header">
                            <h1 className="heading">{displayData?.title}</h1>
                            <h className="post-time">Posted : {formattedDate}</h>
                        </div>
                        <div className="blog-banner my-4"><img src={`${displayData?.featuredImage?.path}`} alt="" /></div>
                        <div
                            className="blog-content my-4"
                            dangerouslySetInnerHTML={{
                                __html: processQuillContent(displayData?.content),
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default BlogView