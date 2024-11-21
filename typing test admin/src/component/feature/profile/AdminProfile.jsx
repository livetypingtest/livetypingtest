import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { dynamicToast } from '../../shared/Toast/DynamicToast'
import { BASE_API_URL } from '../../../util/API_URL'
import UpdatePassModal from './UpdatePassModal'
import { handleAdminProfileUpload, resetState } from '../../../redux/AdminDataSlice'

const AdminProfile = () => {

  const rawAdminData = useSelector(state => state.AdminDataSlice.adminData) 
  const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled) 
  const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg) 
  const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing) 
  const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg) 
  const [formattedDate, setFormattedDate] = useState();
  const dispatch = useDispatch();
  const [imagePath, setImagePath] = useState('');
  const profileRef = useRef();
  const [loader, setLoader] = useState({state : false, for : ''})


// for setting time or converting it----------------------------------------------------
    useEffect(() => {
    if (rawAdminData?.createdate) {
        // Try converting the date string to a JavaScript Date object
        const rawDate = rawAdminData.createdate;
        
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
        // console.log('Invalid date format:', rawAdminData); 
    }, [rawAdminData]);
  // for setting time or converting it----------------------------------------------------
  
    useEffect(()=>{
        if(isFullfilled) {
        if(fullFillMsg?.type === 'profile') {
            setLoader({state : false, for : ''})
            dispatch(resetState())
        }
        dispatch(resetState())
        }
    }, [ isFullfilled, fullFillMsg ])


  // handle upload profile------------------------------------------------------------------------------

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check the file type for additional validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      dynamicToast({ message: 'Please upload a valid image file (jpeg, jpg, or png).', icon: 'error' });
      return;
    }

    // Prepare the file for upload
    const formData = new FormData();
    formData.append('profile', file); // 'profilePic' is the key you'll use on the server-side

    dispatch(handleAdminProfileUpload(formData))
  };

  useEffect(()=>{
    if(rawAdminData) {
      setImagePath(rawAdminData?.profileimage?.s3url)
      console.log(rawAdminData?.profileimage?.s3url)
    }
  }, [rawAdminData])
  
  // handle upload profile------------------------------------------------------------------------------

  useEffect(()=>{
    if(isProcessing) {
      if(processingMsg?.type === 'profile') {
        setLoader({state : true, for : 'profile'})
        dispatch(resetState())
      }
      
    }
  }, [ isProcessing, processingMsg ])


  return (
    <>
        <section>
            <div className="container pt-7 pb-5">
                <div className="row pt-7">
                    <div className="col-md-8 offset-md-2">
                        <div className="admin-profile-layout">
                            <div className="profile-sec1">
                                <div className="profile-upload-main">
                                <img src={imagePath ? `${imagePath}` : "/assets/images/profile.png"}  alt="" />
                                    {
                                    loader.state && loader.for === 'profile' && (<div className="profile-loader"><i className="fa-duotone fa-solid fa-loader fa-spin-pulse fa-2xl" style={{color : '#000'}} /></div>)
                                    }
                                    <div className='profile-upload'><button className='btn' onClick={()=>profileRef?.current?.click()}><i class="fa-solid fa-upload cs-font-dark fa-xl"></i></button></div>
                                    <input type="file" ref={profileRef} onChange={handleFileChange} style={{visibility : 'hidden'}} />
                                </div>
                                <div className="text-center mt-12">
                                    <h4 className="font-active m-0">{rawAdminData?.username}</h4>
                                    <hp className="font-idle">{formattedDate}</hp>
                                </div>
                            </div>
                            <div className="profile-sec2">
                                <div>
                                    <h5>User Name : </h5>
                                    <p>{rawAdminData?._id}</p>
                                </div>
                                <div>
                                    <h5>Password : </h5>
                                    <button type="button" className='btn' data-bs-toggle="modal" data-bs-target="#updatepassword">
                                        <i className="fa-regular text-idle fa-pen-to-square"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    <UpdatePassModal props={'notEmpty'}  />
    </>
  )
}

export default AdminProfile