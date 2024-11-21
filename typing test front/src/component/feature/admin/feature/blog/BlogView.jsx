import { useParams } from "react-router-dom"
import Footer from "../../../../shared/footer/Footer"
import Header from "../../../../shared/header/Header"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../../../util/API_URL";


const BlogView = () => {

    const param = useParams();
    const blogData = useSelector(state => state.AdminDataSlice.blog)
    const [displayData, setDisplayData] = useState([])
    const [formattedDate, setFormattedDate] = useState();

    useEffect(()=>{
        if(blogData) {
            const filteredData = blogData?.filter(value => value._id === param?.id)
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

  return (
    <>
    <Header />
        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-header">
                            <h1 className="heading">{displayData?.title}</h1>
                            <h className="post-time">Posted : {formattedDate}</h>
                        </div>
                        <div className="blog-banner my-4"><img src={`${BASE_API_URL}/uploads/featuredImage/${displayData?.featuredImage?.name}`} alt="" /></div>
                        <div className="blog-content my-4" dangerouslySetInnerHTML={{ __html: displayData?.content }}>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default BlogView