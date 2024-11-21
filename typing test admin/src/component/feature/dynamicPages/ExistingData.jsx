import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { handleDeleteOneAbout, handleUpdateAboutData, resetState } from "../../../redux/DynamicPagesDataSlice"; // Assuming you have a redux action to update
import {dynamicToast} from '../../shared/Toast/DynamicToast'

const ExistingData = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const aboutData = useSelector(state => state.DynamicPagesDataSlice.about);
  const isProcessing = useSelector(state => state.DynamicPagesDataSlice.isProcessing);
  const isFullfilled = useSelector(state => state.DynamicPagesDataSlice.isFullfilled);
  const fullFillMsg = useSelector(state => state.DynamicPagesDataSlice.fullFillMsg);
  const processingMsg = useSelector(state => state.DynamicPagesDataSlice.processingMsg);
  const [loader, setLoader] = useState({ state : false, index : null, type : '' });

  // Initialize the form data from the aboutData if it exists
  useEffect(() => {
    if (aboutData && aboutData?.metaData && aboutData?.metaData?.length > 0) {
      const initializedItems = aboutData?.metaData?.map(item => ({
        image: item.imageUrl || null,
        content: item.content,
        btnTitle: item.button?.title,
        buttonUrl: item.button?.url,
        title: item.title,
        editMode: false, // Edit mode for pre-existing items
        isNew: false, // Flag to differentiate pre-existing items
        id: item._id
      }));
      setItems(initializedItems);
    }
  }, [aboutData]);

  // Handle removing an item
  const handleRemoveItem = (ID) => {
    // console.log(ID)
    dispatch(handleDeleteOneAbout(ID))
  };

  // Handle image upload for a specific item
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    const updatedItems = [...items];
    updatedItems[index].image = file;
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

  // Toggle edit mode
  const handleToggleEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index].editMode = !updatedItems[index].editMode;
    setItems(updatedItems);
  };

  const handleSaveChanges = (index) => {
    const updatedItem = items[index];

    // Validation: Check if any required field is empty
    if (!updatedItem.id || !updatedItem.title || !updatedItem.content || !updatedItem.btnTitle || !updatedItem.buttonUrl) {
        dynamicToast({ message: 'Please fill in all fields before saving', timer : 3000, icon: 'error' });
        return; // Stop execution if validation fails
    }

    // Create a FormData object
    const formData = new FormData();

    // Append the fields to the FormData
    formData.append('id', updatedItem.id);
    formData.append('title', updatedItem.title);
    formData.append('content', updatedItem.content);
    formData.append('btnTitle', updatedItem.btnTitle);
    formData.append('buttonUrl', updatedItem.buttonUrl);

    // Check if the image has been updated and is a File
    if (updatedItem.image instanceof File) {
        // If it's a new file, append it to the form data
        formData.append('image', updatedItem.image);
    } 

    const obj = {
        formData: formData,
        ID: updatedItem?.id
    };

    setLoader({ state: true, index: index, type: 'save' });

    // Dispatch the update action
    dispatch(handleUpdateAboutData(obj));

    // Toggle edit mode off
    // handleToggleEdit(index);
};


const toggleEditMode = (index) => {
    setItems((prevItems) =>
        prevItems.map((item, i) =>
            i === index ? { ...item, editMode: !item.editMode } : item
        )
    );
};

    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg.type === 'aboutDeleteOne') {
                setLoader({state : false, index : null, type : ''});
            }
            if (fullFillMsg.type === 'aboutUpdate') {
                setLoader({state : false, index : null, type : ''});
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg]);


  return (
    <>
      {items?.map((item, index) => (
        <>
          <div className="mt-5 mb-2"><h4>Section {index + 1}</h4></div>
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
                <h5>Button</h5>
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
                onClick={() => document.getElementById(`fileInput-${index}`).click()}
              >
                {item.image ? (
                  typeof item.image === 'string' ? (
                    <img src={item.image} alt="Preview" />
                  ) : (
                    item.image instanceof File ? (
                      <img src={URL.createObjectURL(item.image)} alt="Preview" />
                    ) : (
                      <span>Error loading image</span>
                    )
                  )
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
                  onClick={() => {handleRemoveItem(item.id), setLoader({state : true, index : index, type : 'delete'})}}
                >
                  Delete { loader.state && loader.index === index && loader.type === 'delete' && <i className="fa-solid fa-circle-notch fa-spin " style={{ color: "#fff" }} /> }
                </button>
                {
                    item.editMode ? (
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => handleSaveChanges(index)}
                        >
                            Save { loader.state && loader.index === index && loader.type === 'save' && <i className="fa-solid fa-circle-notch fa-spin " style={{ color: "#fff" }} /> }
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => toggleEditMode(index)}
                        >
                            Edit
                        </button>
                    )
                }

              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default ExistingData;
