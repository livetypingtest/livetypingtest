import { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropUtils'; // Helper function for cropping
import { dynamicToast } from '../../../../shared/Toast/DynamicToast';
import { handleProfileStatus, handleUploadProfile, resetState } from '../../../../../redux/UserDataSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';

const ProfileUpdateModal = ({ initialProfileImage, googleProfileImage, type }) => {

    const dispatch = useDispatch()
    const fileInputRef = useRef();
    const clsModal = useRef();

    const [profileImage, setProfileImage] = useState(initialProfileImage || '');
    const [customImage, setCustomImage] = useState(null);
    const [loader, setLoader] = useState({state : false, for : ''})
    const [croppedImage, setCroppedImage] = useState(null);
    const [finalImage, setFinalImage] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropping, setCropping] = useState(false);
    const [selectedOption, setSelectedOption] = useState(type === 'custom' ? 'saved' : type); // Track selected option

    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled) 
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg) 
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing) 
    const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)

    const onCropComplete = async (croppedArea, croppedAreaPixels) => {
        const croppedImg = await getCroppedImg(customImage, croppedAreaPixels);
        setCroppedImage(croppedImg);
    };

    const handleGoogleProfile = () => {
        setSelectedOption('google');
        setProfileImage(googleProfileImage);
        setCroppedImage(null);
    };

    const handleRemoveProfile = () => {
        setSelectedOption('empty');
        setProfileImage('');
        setCroppedImage(null);
    };

    const handleCustomPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedOption('custom');
            setCustomImage(URL.createObjectURL(file));
            setCropping(true);
            // setFinalImage(file)
            // handleFileChange(file)
        }
    };

    const handleFileChange = async () => {

        // console.log(finalImage)
    
        if (!finalImage) {
            return;
        }
    
        // Check the file type for additional validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(finalImage.type)) {
            dynamicToast({ message: 'Please upload a valid image file (jpeg, jpg, or png).', icon: 'error' });
            return;
        }
    
        // Prepare the file for upload
        const formData = new FormData();
        formData.append('profile', finalImage); // 'profilePic' is the key you'll use on the server-side
    
        dispatch(handleUploadProfile(formData))
    };

    const saveCustomPhoto = async () => {
        try {
            if (!croppedImage) {
                console.error("No cropped image available");
                return;
            }
        
            // Convert croppedImage (URL) to Blob
            const response = await fetch(croppedImage);
            const blob = await response.blob();

            console.log(blob)
        
            // Convert Blob to File
            const file = new File([blob], "updated-image", { type: blob.type });
        
            // Save the File in state for uploading
            setFinalImage(file);
        
            // Reset states
            setProfileImage(croppedImage);
            setCropping(false);
            setCustomImage(null);
        
            console.log("Image saved successfully:", file);
        } catch (error) {
            console.error("Error saving custom photo:", error);
        }
    };
      

    const cancelCropping = () => {
        setCropping(false);
        setCustomImage(null);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option === 'google') handleGoogleProfile();
        if (option === 'empty') handleRemoveProfile();
        if (option === 'custom') fileInputRef.current.click();
    };

    const toggleViewProfile = (option) => {
        dispatch(handleProfileStatus({display: option}))
    }

    const makeChangesStatice = () => {
        selectedOption === 'custom' ? handleFileChange() : 
        selectedOption === 'saved' ? toggleViewProfile('custom') :
        toggleViewProfile(selectedOption)
    }

    const reset = () => {
        setSelectedOption(type)
        setProfileImage(initialProfileImage)
        setCustomImage(null)
        setCroppedImage(null)
        setFinalImage(null)
    }

    useEffect(()=>{
        if(isFullfilled) {
        if(fullFillMsg?.type === 'profile') {
            setLoader({state : false, for : ''})
            clsModal.current?.click()
            dispatch(resetState())
        }
        dispatch(resetState())
        }
    }, [ isFullfilled, fullFillMsg ])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'profile') {
                setLoader({state : true, for : 'profile'})
                dispatch(resetState())
            }
        }
    }, [ isProcessing, processingMsg ])

    return (
        <div
            className="modal fade"
            id="profile"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="profile"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body">
                        <div className="pass-modal">
                            <div className="prof-header">
                                <h4 className="font-active">Update Profile Picture</h4>
                                <button
                                    type="button"
                                    className="btn"
                                    data-bs-dismiss="modal"
                                    ref={clsModal}
                                    onClick={reset}
                                >
                                    <i class="fa-solid fa-2xl fa-xmark" style={{color: 'red'}} />
                                </button>
                            </div>
                            <div className="pass-body my-4 text-center">
                                {!cropping ? (
                                    <div className="image-options d-flex justify-content-around">
                                        {/* Remove Image Box */}
                                        <div>
                                            <div
                                                className={`radio-box ${
                                                    selectedOption === 'saved' ? 'selected' : ''
                                                }`}
                                                onClick={() => handleOptionChange('saved')}
                                            >
                                                <img
                                                    src={initialProfileImage}
                                                    alt="Google Profile"
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                            <p className="font-idle mt-1">Saved Profile</p>
                                        </div>

                                        {/* Google Profile Box */}
                                        <div>
                                            <div
                                                className={`radio-box ${
                                                    selectedOption === 'google' ? 'selected' : ''
                                                }`}
                                                onClick={() => handleOptionChange('google')}
                                            >
                                                <img
                                                    src={googleProfileImage || 'https://via.placeholder.com/100'}
                                                    alt="Google Profile"
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                            <p className="font-idle mt-1">Google Profile</p>
                                        </div>

                                        {/* Custom Photo Box */}
                                        <div>
                                            <div
                                                className={`radio-box ${
                                                    selectedOption === 'custom' ? 'selected' : ''
                                                }`}
                                                onClick={() => handleOptionChange('custom')}
                                            >
                                                {
                                                    profileImage ? (
                                                        <img src={profileImage} alt="" />
                                                    ) : (
                                                        <i class="fa-duotone fa-solid fa-plus-large"></i>
                                                    )
                                                }
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleCustomPhotoChange}
                                                />
                                            </div>
                                            <p className="font-idle mt-1">Preview/Add</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="crop-container">
                                        <Cropper
                                            image={customImage}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
                                        />
                                        <div className="crop-controls mt-3">
                                            <button
                                                type='button'
                                                className="theme-btn sm bg-success text-white"
                                                onClick={saveCustomPhoto}
                                            >
                                                <i class="fa-solid fa-check" style={{color: '#fff'}} />
                                            </button>
                                            <button
                                                type='button'
                                                className="theme-btn sm bg-danger text-white"
                                                onClick={cancelCropping}
                                            >
                                                <i class="fa-solid fa-xmark" style={{color: '#fff'}} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="pass-footer">
                                <button
                                    className="theme-btn sm bg-idle"
                                    onClick={() => toggleViewProfile('empty')}
                                >
                                    Remove Profile
                                </button>
                                <button
                                    type='submit'
                                    className="theme-btn sm"
                                    onClick={makeChangesStatice}
                                    // disabled={!profileImage}
                                >
                                    {loader?.state ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdateModal;
