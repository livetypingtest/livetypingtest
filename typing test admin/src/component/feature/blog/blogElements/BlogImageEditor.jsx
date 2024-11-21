import { useState } from 'react';

const BlogImageEditor = () => {
    const [imagePreview, setImagePreview] = useState(null);

    // Handle image selection from file input
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    // Trigger file input click when clicking on the image preview area
    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

  return (
        <>
        <div className="blog-main-layout">
            <div className="blog-side-header">
                Image
            </div>
            <div className='blog-img-container my-3' onClick={handleImageClick}>
                {imagePreview ? (
                <img className='blog-image' src={imagePreview} alt="Preview" />
                ) : ( null
                // <div style={styles.placeholder}>
                //     <img
                //     src="https://via.placeholder.com/60?text=+" // Placeholder icon
                //     alt="Placeholder icon"
                //     className='placeholder'
                //     />
                // </div>
                )}
            </div>
            <input
                type="file"
                id="fileInput"
                onChange={handleImageChange}
                style={{display : "none"}}
            />
            <div className='text-center' >
                <label className='text-center text-primary' htmlFor="fileInput" >
                Choose image
                </label>
            </div>
        </div>
        </>
  );
};

export default BlogImageEditor;
