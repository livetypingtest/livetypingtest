import { useFormik } from "formik";
import Footer from "../../../../shared/footer/Footer";
import Header from "../../../../shared/header/Header";
import contactUsSchema from "../../../../../schemas/ContactUsSchema";
import axios from 'axios'
import {BASE_API_URL} from '../../../../../util/API_URL'
import {dynamicToast} from '../../../../shared/Toast/DynamicToast'
import { useEffect, useState } from "react";
import DynamicAlert from "../../../../shared/Toast/DynamicAlert";

const Contact = () => {

  const [loader, setLoader] = useState(false)
  const [alertDetail, setAlertDetail] = useState({
    title : '',
    message : '',
    type : '',
    navigateTo : '',
    confirmBtn : false
})
const [showAlert, setShowAlert] = useState(false)

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
      senderid: "",
      time : Date.now()
    },
    validationSchema: contactUsSchema,
    onSubmit: async(formData) => {
      formData.senderid = localStorage.getItem('userToken')
      setLoader(true)
      const response = await axios.post(`${BASE_API_URL}/contact`, formData)  
      if(response.data.status === 200) {
        setLoader(false)
        formik.resetForm()
        dynamicToast({ message: 'Form Submitted Successfully!', timer: 3000, icon: 'success' })
      } else {
        dynamicToast({ message: 'Error Submitting Form Try Again Later', timer: 3000, icon: 'error' })
      }
    },
  });

  useEffect(()=>{
    if(!localStorage.getItem('userToken')) {
      setShowAlert(true)
      setAlertDetail({
        title: 'Login Required',
        type: 'info',
        message: 'Please log in or sign up to contact us or access this feature. We look forward to assisting you!',
        navigateTo: '/signup',
        confirmBtn: false
      });      
    }
  }, [])

  const handleAlertClose = () => {
    localStorage.removeItem('newRecord'); // Clear local storage
    setShowAlert(false); // Set showAlert to false
};

  return (
    <>
      <Header />
      <section>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 offset-md-1 col-10 offset-1">
              <div className="contact-section">
                <h4 className="font-active text-left">Free To Contact Us</h4>
                <div className="contact-div">
                  <div className="auth">
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className=" text-danger text-sm error">{formik.errors.name}</div>
                    )}
                  </div>

                  <div className="auth">
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger text-sm error">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="auth-cs">
                  <textarea
                    placeholder="Message"
                    {...formik.getFieldProps("message")}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className=" text-danger text-sm error">{formik.errors.message}</div>
                  )}
                </div>
                <button className="theme-btn sm" onClick={formik.handleSubmit}>
                  Submit { loader && <i className="fa-solid fa-circle-notch fa-spin " style={{ color: "#15131a" }} /> }
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />


          <DynamicAlert
            type={alertDetail.type}
            title={alertDetail.title}
            message={alertDetail.message}
            trigger={showAlert} // This will trigger the alert
            navigateTo={alertDetail.navigateTo}
            confirmBtn={alertDetail.confirmBtn}
            onClose={handleAlertClose} // Pass the onClose handler
            />
    </>
  );
};

export default Contact;
