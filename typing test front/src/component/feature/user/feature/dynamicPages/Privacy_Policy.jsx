import { useState } from "react"
import Footer from "../../../../shared/footer/Footer"
import Header from "../../../../shared/header/Header"
import {useSelector} from 'react-redux'
import { useEffect } from "react"


const Privacy_Policy = () => {

  const privacyData = useSelector(state => state.DynamicPagesDataSlice?.privacy)
  const [formattedDate, setFormattedDate] = useState();

  useEffect(() => {
    if (privacyData?.createdat) {
      // Try converting the date string to a JavaScript Date object
      const rawDate = privacyData.createdat;
      
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
      console.log('Invalid date format:', privacyData); 
    }, [privacyData]);

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
        <Header />
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                      <div className="header-dynamic-page">
                        <h4 className="font-active">Privacy & Policy</h4>
                        <p className="font-idle">{formattedDate}</p>
                      </div>
                      <div
                          className="dynamic-paglayout my-4"
                          dangerouslySetInnerHTML={{
                              __html: processQuillContent(privacyData?.content),
                          }}
                      ></div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default Privacy_Policy