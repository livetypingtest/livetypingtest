import * as Yup from 'yup'

const SeoSetupSchema = Yup.object({
    seoTitle: Yup.string()
      .required("SEO Title is required")
      .max(60, "SEO Title cannot exceed 60 characters"),
    seoDescription: Yup.string()
      .required("SEO Description is required")
      .max(160, "SEO Description cannot exceed 160 characters"),
    seoImage: Yup.mixed()
      .required("SEO Image is required")
      .test("fileSize", "Image size is too large", (value) => {
        return value && value.size <= 2 * 1024 * 1024; // Max size: 2MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        return (
          value &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }),
  })





export default SeoSetupSchema