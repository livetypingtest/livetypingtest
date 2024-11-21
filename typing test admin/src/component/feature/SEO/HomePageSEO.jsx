import React, { useState } from "react";
import { useFormik } from "formik";
import SeoSetupSchema from "../../../schemas/SeoSetupSchema";
import axios from'axios'
import {ADMIN_API_URL} from '../../../util/API_URL'
import { dynamicToast } from "../../shared/Toast/DynamicToast";

const HomePageSEO = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      seoTitle: "",
      seoDescription: "",
      seoImage: null,
    },
    validationSchema: SeoSetupSchema,
    onSubmit: async (formData) => {
        setIsSubmitting(true);
    
        const ID = localStorage.getItem('adminToken')
        const response = await axios.post(`${ADMIN_API_URL}/home-seo`, formData, {
            headers : {
                "Content-Type": "multipart/form-data",
                Authorization : ID
            }
        })

        if(response.data.status === 200) {
            setIsSubmitting(false);
            formik.resetForm()
            dynamicToast({ message: 'SEO Added Successfully!', timer : 3000, icon: 'success' });
        }

    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("seoImage", file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBoxClick = () => {
    document.getElementById("seoImageInput").click();
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card bg-theme">
                <div className="card-header">
                  <h4>Set Home Page SEO</h4>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="card-body">
                    {/* SEO Title */}
                    <div className="my-3">
                      <label htmlFor="seoTitle">SEO Title</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.seoTitle && formik.errors.seoTitle
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter SEO Title"
                        name="seoTitle"
                        value={formik.values.seoTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.seoTitle && formik.errors.seoTitle && (
                        <div className="invalid-feedback">
                          {formik.errors.seoTitle}
                        </div>
                      )}
                    </div>

                    {/* SEO Description */}
                    <div className="my-3">
                      <label htmlFor="seoDescription">SEO Description</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.seoDescription &&
                          formik.errors.seoDescription
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter SEO Description"
                        name="seoDescription"
                        value={formik.values.seoDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.seoDescription &&
                        formik.errors.seoDescription && (
                          <div className="invalid-feedback">
                            {formik.errors.seoDescription}
                          </div>
                        )}
                    </div>

                    {/* SEO Image */}
                    <div className="my-3">
                      <label htmlFor="seoImage">SEO Image</label>
                      <div
                        onClick={handleBoxClick}
                        className="upload-box"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                             className="upload-image-preview"
                          />
                        ) : (
                          <span>Tap to upload</span>
                        )}
                      </div>
                      <input
                        id="seoImageInput"
                        type="file"
                        name="seoImage"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.seoImage && formik.errors.seoImage && (
                        <div className="text-danger mt-2">
                          {formik.errors.seoImage}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer text-start">
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>{" "}
                          Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePageSEO;
