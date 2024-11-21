import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { handlePostAboutData, resetState } from '../../../redux/DynamicPagesDataSlice';
import ExistingData from "./ExistingData";

const ImageTextRepeater = () => {
  const [items, setItems] = useState([{
        image: null, content: "", btnTitle: "", buttonUrl: "", title: "", 
        editMode: true, // No toggle button initially for new items
        isNew: true // Flag to differentiate new items
  }]);
  const dispatch = useDispatch();
  const clrForm = useRef();
  const [loader, setLoader] = useState(false);
  const isProcessing = useSelector(state => state.DynamicPagesDataSlice.isProcessing);
  const isFullfilled = useSelector(state => state.DynamicPagesDataSlice.isFullfilled);
  const fullFillMsg = useSelector(state => state.DynamicPagesDataSlice.fullFillMsg);
  const processingMsg = useSelector(state => state.DynamicPagesDataSlice.processingMsg);

  // Handle adding new repeater items
  const handleAddItem = () => {
    setItems([
      ...items,
      { 
        image: null, content: "", btnTitle: "", buttonUrl: "", title: "", 
        editMode: true, // No toggle button initially for new items
        isNew: true // Flag to differentiate new items
      }
    ]);
  };

  // Handle removing an item
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle image upload for a specific item
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];  // Get the file from the input
    const updatedItems = [...items];
    
    // If a valid file is uploaded, update the image preview
    if (file) {
      updatedItems[index].image = file;  // Store the file itself (you can later upload it to a server)
    } else {
      updatedItems[index].image = null;  // If no file selected, clear the image
    }

    setItems(updatedItems);
  };

  // Handle text change for a specific item
  const handleTextChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].content = e.target.value;
    setItems(updatedItems);
  };

  // Handle title change for a specific item
  const handleTitleChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].btnTitle = e.target.value;
    setItems(updatedItems);
  };

  // Handle title change for a specific item
  const handleMainTitleChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].title = e.target.value;
    setItems(updatedItems);
  };

  // Handle button URL change for a specific item
  const handleButtonUrlChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index].buttonUrl = e.target.value;
    setItems(updatedItems);
  };

  // Submit form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    items.forEach((item, index) => {
      if (item.image) {
        formData.append("images", item.image);  // Append image files
      }
      formData.append(`content[${index}]`, item.content);
      formData.append(`btnTitle[${index}]`, item.btnTitle);
      formData.append(`buttonUrls[${index}]`, item.buttonUrl);
      formData.append(`title[${index}]`, item.title);
      formData.append(`date`, new Date());
    });

    // Dispatch form data to backend
    dispatch(handlePostAboutData(formData));

    // Reset the form state or handle response as needed
  };

  useEffect(() => {
    if (isProcessing) {
      if (processingMsg.type === 'about') {
        setLoader(true);
      }
      dispatch(resetState());
    }
  }, [isProcessing, processingMsg]);

  useEffect(() => {
    if (isFullfilled) {
      if (fullFillMsg.type === 'about') {
        setLoader(false);
        clrForm.current?.click(); // Reset form inputs
      }
      dispatch(resetState());
      setLoader(false);
    }
  }, [isFullfilled, fullFillMsg]);

  useEffect(()=>{
    if(isFullfilled) {
      setItems([{
        image: null, content: "", btnTitle: "", buttonUrl: "", title: "", 
        editMode: true, // No toggle button initially for new items
        isNew: true // Flag to differentiate new items
      }]);
    }
  }, [isFullfilled])

  return (
    <section>
      <div className="container pt-7">
        <div className="row">
          <div className="col-md-12">
            <div className="form-container">
              <ExistingData />
              <form onSubmit={handleSubmit}>
                <input ref={clrForm} type="reset" value="" style={{visibility : 'hidden'}} />
                {items.map((item, index) => (
                  <div key={index} className="repeater-item">
                    <div className="left-side">
                      <div className="title-content">
                        <h5>Add Title</h5>
                        <input
                          type="text"
                          placeholder="Enter title"
                          className="form-control"
                          disabled={!item.editMode}
                          value={item.title}
                          onChange={(e) => handleMainTitleChange(index, e)}
                        />
                      </div>
                      <div className="content">
                        <h5>Add Content</h5>
                        <textarea
                          placeholder="Enter some text"
                          className="form-control"
                          value={item.content}
                          disabled={!item.editMode}
                          onChange={(e) => handleTextChange(index, e)}
                        />
                      </div>
                      <div className="btn-info">
                        <h5> Button</h5>
                        <input
                          type="text"
                          placeholder="Enter title"
                          className="form-control"
                          disabled={!item.editMode}
                          value={item.btnTitle}
                          onChange={(e) => handleTitleChange(index, e)}
                        />
                        <input
                          type="url"
                          className="form-control"
                          disabled={!item.editMode}
                          placeholder="Enter button URL"
                          value={item.buttonUrl}
                          onChange={(e) => handleButtonUrlChange(index, e)}
                        />
                      </div>
                    </div>
                    
                    <div className="right-side">
                      <div
                        className="image-box"
                        onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
                      >
                        {item.image ? (
                          <img src={URL.createObjectURL(item.image)} alt="Preview" />
                        ) : (
                          <span>Click to upload</span>
                        )}
                      </div>
                      <input
                        type="file"
                        id={`fileInput-${index}`}
                        className="file-input"
                        onChange={(e) => handleImageUpload(index, e)}
                        accept="image/*"
                      />
                      <div className="about-btn">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                        {!item.isNew && (
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => handleToggleEdit(index)}
                          >
                            {item.editMode ? "Save" : "Edit"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="about-btn">
                  <button type="button" onClick={handleAddItem} className="btn btn-success">
                    Add Item
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit { loader && <i className="fa-solid fa-circle-notch fa-spin " style={{ color: "#fff" }} /> }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextRepeater;
