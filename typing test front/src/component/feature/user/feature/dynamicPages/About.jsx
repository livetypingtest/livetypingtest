import Header from '../../../../shared/header/Header';
import Footer from '../../../../shared/footer/Footer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DynamicTitle from '../../../../shared/helmet/DynamicTitle';

const About = () => {
  const aboutData = useSelector(state => state.DynamicPagesDataSlice?.about);
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    if (aboutData) {
      setDisplayData(aboutData?.metaData);
    }
  }, [aboutData]);


  return (
    <>
      <DynamicTitle title={"Live Typing Test | About"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | About"}  />
      <Header />
      <section className="about-main">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="header-dynamic-page">
                <h4 className="font-active">About Us</h4>
              </div>
              {displayData?.length !== 0 &&
                displayData?.map((value, index) => (
                  <div className="about-section" key={index}>
                    <div className="row align-items-center justify-content-between">
                      {value?.imageUrl ? (
                        <>
                          {/* Original Layout with Image and Text */}
                          <div className="col-md-6">
                            <h4 className="font-active text-left mb-4">{value?.title}</h4>
                            <p className="mb-4">{value?.content}</p>
                            {value?.button?.title && (
                              <div className='align-me'>
                                <a className="btn theme-btn sm" href={value?.button?.url}>
                                  {value?.button?.title}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="col-md-5">
                            <div className="about-img">
                              <img src={value.imageUrl} alt="" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Full-Width Layout without Image */}
                          <div className="col-md-12">
                            <h4 className="font-active text-left mb-4">{value?.title}</h4>
                            <p className="mb-4">{value?.content}</p>
                            {value?.button?.title && (
                              <div className='align-me'>
                                <a className="btn theme-btn sm" href={value?.button?.url}>
                                  {value?.button?.title}
                                </a>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
