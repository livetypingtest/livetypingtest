import { useParams } from "react-router-dom";
import Footer from "../../../../shared/footer/Footer";
import Header from "../../../../shared/header/Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DynamicTitle from '../../../../shared/helmet/DynamicTitle'

const BlogInner = () => {
    const param = useParams();
    const blogData = useSelector(state => state.UserDataSlice.blog);
    const [displayData, setDisplayData] = useState(null); // Initializing with null
    const [formattedDate, setFormattedDate] = useState();

    useEffect(() => {
        const filteredData = blogData?.filter(value => value.permalink === param?.id);
        setDisplayData(filteredData ? filteredData[0] : null); // Handle cases where no data found
    }, [blogData, param]);

    useEffect(() => {
        if (displayData?.createdat) {
            const rawDate = displayData.createdat;
            const parsedDate = new Date(rawDate);
            if (!isNaN(parsedDate)) {
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
    }, [displayData]);

    // Only render SEO tags when displayData is available
    if (!displayData) return null;

    // console.log(displayData)

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
            <DynamicTitle title={`${displayData.seoTitle}`} icon={`${displayData?.featuredImage?.path}`} description={`${displayData.seoDescription}`}  />

            <Header />
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="blog-header">
                                <h1 className="heading">{displayData?.title}</h1>
                                <h6 className="post-time">Posted : {formattedDate}</h6>
                            </div>
                            {/* Render pills for blog categories */}
                            <div className="blog-categories my-3">
                                {displayData?.category?.map((category, index) => (
                                    <span key={index} className="blog-category-pill">
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <div className="blog-banner my-4">
                                <img src={displayData?.featuredImage?.path || '/default-image.jpg'} alt="" />
                            </div>
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
            <Footer />
        </>
    );
};

export default BlogInner;
