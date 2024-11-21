import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { useEffect } from 'react';
import { useState } from 'react';
import {useSelector} from 'react-redux'

const About = () => {

  const aboutData = useSelector(state => state.DynamicPagesDataSlice?.about)
  const [formattedDate, setFormattedDate] = useState();
  const [displayData, setDisplayData] = useState([])

    useEffect(()=>{
      if(aboutData) {
        setDisplayData(aboutData?.metaData)
      }
    }, [aboutData])

  return (
    <>
        <Header />
        <section className='about-main'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                      <div className="header-dynamic-page">
                        <h4 className="font-active">About Us</h4>
                      </div>
                          {
                            displayData?.length !== 0 && displayData?.map((value, index) => (
                              <>
                                <div className="about-section ">
                                  <div className="row align-items-center justify-content-between">
                                  <div className="col-md-6" key={index}>
                                    <h4 className='font-active text-left mb-4'>{value?.title}</h4>
                                    <p className='mb-4'>{value.content}</p>
                                    {
                                      value?.button?.title && (<a className='btn theme-btn sm' href={value?.button?.url}>{value?.button?.title}</a>)
                                    }
                                  </div>
                                  <div className="col-md-5" key={index}><div className="about-img"><img src={value.imageUrl} alt="" /></div></div>
                                </div>
                                </div>
                              </>
                            ))
                          }
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default About