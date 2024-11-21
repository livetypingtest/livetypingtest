import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleBlockUnblockUser, handleGetUser, resetState, handleUploadProfile } from "../../../../../../redux/AdminDataSlice";
import { NavLink, useParams } from "react-router-dom";
import Footer from "../../../../../shared/footer/Footer";
import Header from "../../../../../shared/header/Header";
import { BASE_API_URL } from "../../../../../../util/API_URL";
import DeleteUserModal from "../modals/DeleteUserModal";
import { dynamicToast } from "../../../../../shared/Toast/DynamicToast";
import UpdatePassModal from "../modals/UpdatePassModal";

const UserDetail = () => {

    const dispatch = useDispatch();
    const param = useParams(); 
    const rawUserData = useSelector(state => state.AdminDataSlice.userData) 
    let matches1Min = rawUserData?.match_1 || []
    let matches3Min = rawUserData?.match_3 || []
    let matches5Min = rawUserData?.match_5 || []
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled) 
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing) 
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg) 
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg) 
    const [formattedDate, setFormattedDate] = useState();
    const [totalMatchesCompleted, setTotalMatchesCompleted] = useState(0);
    const [totalTimeOfMatches, setTotalTimeOfMatches] = useState(0);
    const [match1MinData, setMatch1MinData] = useState([])
    const [match3MinData, setMatch3MinData] = useState([])
    const [match5MinData, setMatch5MinData] = useState([])
    const [loader, setLoader] = useState({state : false, for : ''})
    const [imagePath, setImagePath] = useState('');
    const profileRef = useRef();
  
  useEffect(()=>{
    dispatch(handleGetUser(param.username))
  }, [])
    
  // for finding the total matches----------------------------------------------------
  useEffect(()=>{
  
    setTotalMatchesCompleted(matches1Min?.length + matches3Min?.length + matches5Min?.length)
  
    // calculate total time of all mathes played----------------------------------------------
  
  const convertSecondsToFormattedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600); // Get the number of hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Get the number of minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds
  
    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    // Return the formatted time
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  };
  
  const calculateTotalTime = (matches1Min?.length * 60) + (matches3Min?.length * 180) + (matches5Min?.length * 300)
  setTotalTimeOfMatches(convertSecondsToFormattedTime(calculateTotalTime))
  
  // calculate total time of all mathes played--------------------------------------------------------
  
  },[matches1Min, matches3Min, matches5Min])
  // for finding the total matches----------------------------------------------------
  
  // for setting time or converting it----------------------------------------------------
  useEffect(() => {
    if (rawUserData?.createdate) {
      // Try converting the date string to a JavaScript Date object
      const rawDate = rawUserData.createdate;
      
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
      // console.log('Invalid date format:', rawUserData); 
    }, [rawUserData]);
    // for setting time or converting it----------------------------------------------------
    
    // update the matches data based on time seperation----------------------------------------------------
    
    useEffect(()=>{
      if(matches1Min || matches3Min || matches5Min) {
        updateMatchesData('match1')
        updateMatchesData('match3')
        updateMatchesData('match5')
      }
      
    }, [rawUserData, matches1Min, matches3Min, matches5Min])

    const updateMatchesData = (match) => {
      const splitFncName = {
        match1: matches1Min,
        match3: matches3Min,
        match5: matches5Min,
      };
    
      const functName = splitFncName[match];
    
      // Check if functName is valid
      if (!functName) {
        console.error(`Invalid match type: ${match}`);
        return;
      }
    
      // Create a structure to hold difficulty data
      const difficultyData = {
        easy: [],
        medium: [],
        hard: [],
      };
    
      // Populate difficulty data
      functName.forEach((value) => {
        if (difficultyData[value.level]) {
          difficultyData[value.level].push(value);
        }
      });
    
      // Prepare final data object
      const finalData = {};
  
      const changeProperty = {
        'match1': 'top1minavg',
        'match3': 'top3minavg',
        'match5': 'top5minavg',
      }
      const findProp = changeProperty[match]
      Object.keys(difficultyData).forEach((level) => {
        const matches = difficultyData[level];
        const data = rawUserData[findProp]
        finalData[`${level}Matches`] = matches.length;
        finalData['data'] = data
      });
      // console.log(finalData)
    
      // Update state based on match type
      switch (match) {
        case 'match1':
          setMatch1MinData(finalData);
          break;
        case 'match3':
          setMatch3MinData(finalData);
          break;
        case 'match5':
          setMatch5MinData(finalData);
          break;
        default:
          console.warn(`Unhandled match type: ${match}`);
      }
    };
    
    // update the matches data based on time seperation----------------------------------------------------
    
    useEffect(()=>{
      if(isProcessing) {
        if(processingMsg?.type === 'block-unblock') {
          setLoader({state : true, for : 'block-unblock'})
          dispatch(resetState())
        }
      }
    }, [ isProcessing, processingMsg ])

    useEffect(()=>{
      if(isFullfilled) {
        if(fullFillMsg?.type === 'block-unblock') {
          dynamicToast({ message: "Account Toggled Successfully!", icon: "success" });
          setLoader({state : false, for : ''})
          dispatch(resetState())
        }
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
    const profileData = new FormData();
    profileData.append('profile', file); // 'profile' is the key you'll use on the server-side

      const obj = {
        formData : profileData,
        username : rawUserData?.username
      }

      dispatch(handleUploadProfile(obj))
    };
  
    useEffect(()=>{
            if(rawUserData) {
            matches1Min = rawUserData?.match_1 
            matches3Min = rawUserData?.match_3 
            matches5Min = rawUserData?.match_5 
            setImagePath(rawUserData?.profileimage?.newname)
        }
    }, [rawUserData])
    

    const blockUser = () =>{
      dispatch(handleBlockUnblockUser(rawUserData?.username))
    }

    

  return (
    <>
        <Header />
      <section className='user-profile py-5'>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="profile-layout">
                <div className="profile-sec1">
                  <div className='profile-upload-main'>
                    <img src={imagePath ? `${BASE_API_URL}/uploads/profile/${imagePath}` : "/assets/images/profile.png"}  alt="" />
                    <div className='profile-upload'><button onClick={()=>profileRef?.current?.click()}><i className="fa-regular fa-upload fa-xl" style={{ color: "#71cac7" }} /></button></div>
                    <input type="file" ref={profileRef} onChange={(event)=>{handleFileChange(event)}} style={{visibility : 'hidden'}} />
                  </div>
                  <div className='text-center mt-12'>
                    <h4 className='font-active'>{rawUserData?.username}</h4>
                    <hp className='font-idle'>Joined {formattedDate ? formattedDate : null}</hp>
                  </div>
                </div>
                  <div className="profile-sec2">
                    {/* Name Input Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="Name">Name :</label>
                        <button
                        type="submit"
                        >
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      <input
                        name="username"
                        readOnly
                        value={rawUserData?.username}
                        type="text"
                        placeholder="User Name"
                      />
                    </div>

                    {/* Email Input Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="email">Current Email :</label>
                        <button
                        type="button"
                        >
                            <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      <input
                        name="email"
                        readOnly
                        value={rawUserData?.email}
                        type="email"
                        placeholder="Email ID"
                      />
                    </div>

                    {/* Password Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="password">Current Password :</label>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#updatepassword">
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                      </div>
                      {
                        rawUserData?.password ? (
                          <input
                            name="password"
                            readOnly
                            value={rawUserData?.password}
                            type="password"
                            placeholder="Current Password"
                          />
                        ) : (
                          <input
                            name="password"
                            readOnly
                            value="You Have not set Password"
                            type="text"
                            placeholder="Current Password"
                          />
                        )
                      }
                    </div>
                  </div>
                <div className="profile-sec3">
                  {
                    loader.useState && loader.for === 'block-unblock' ? (<i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#71CAC7" }} />) : null
                  }
                  {
                    rawUserData?.isblock ? (
                      <button onClick={blockUser} className="theme-btn p-10-15 bg-idle width-100">Unblock {rawUserData?.username}</button>
                    ) : (
                      <button onClick={blockUser} className="theme-btn p-10-15 bg-active width-100">Block {rawUserData?.username}</button>
                    )
                  }
                  <button data-bs-toggle="modal" data-bs-target="#deleteaccount" className="delete-btn">Delete Account</button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="profile-stacs">
                <div className="stacs">
                  <div>
                    <h4>Test Started</h4>
                    <h2>{totalMatchesCompleted}</h2>
                  </div>
                  <div>
                    <h4>Test Completed</h4>
                    <h2>26</h2>
                  </div>
                  <div>
                    <h4>Time Typing</h4>
                    <h2>{totalTimeOfMatches}</h2>
                  </div>
                </div>
                <NavLink to={`/admin/users/matches/${'easy'}`}>
                  <div className="stacs">
                    <div>
                      <h4>Easy Level</h4>
                      <p>Total Test</p>
                      <p>Average WPM</p>
                      <p>Average Accuracy</p>
                      <p>Average Consistency</p>
                    </div>
                    <div>
                      <h4>1 Min</h4>
                      <p>{match1MinData?.easyMatches || 0}</p>
                      <p>{Math.round(match1MinData?.data?.easy?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match1MinData?.data?.easy?.avgacc) || 0} %</p>
                      <p>{Math.round(match1MinData?.data?.easy?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>3 Min</h4>
                      <p>{match3MinData?.easyMatches || 0}</p>
                      <p>{Math.round(match3MinData?.data?.easy?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match3MinData?.data?.easy?.avgacc) || 0} %</p>
                      <p>{Math.round(match3MinData?.data?.easy?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>5 Min</h4>
                      <p>{match5MinData?.easyMatches || 0}</p>
                      <p>{Math.round(match5MinData?.data?.easy?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match5MinData?.data?.easy?.avgacc) || 0} %</p>
                      <p>{Math.round(match5MinData?.data?.easy?.avgconsis) || 0} %</p>
                    </div>
                  </div>
                </NavLink>
                <NavLink to={`/admin/users/matches/${'medium'}`}>
                  <div className="stacs">
                    <div>
                      <h4>Medium Level</h4>
                      <p>Total Test</p>
                      <p>Average WPM</p>
                      <p>Average Accuracy</p>
                      <p>Average Consistency</p>
                    </div>
                    <div>
                      <h4>1 Min</h4>
                      <p>{match1MinData?.mediumMatches || 0}</p>
                      <p>{Math.round(match1MinData?.data?.medium?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match1MinData?.data?.medium?.avgacc) || 0} %</p>
                      <p>{Math.round(match1MinData?.data?.medium?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>3 Min</h4>
                      <p>{match3MinData?.mediumMatches || 0}</p>
                      <p>{Math.round(match3MinData?.data?.medium?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match3MinData?.data?.medium?.avgacc) || 0} %</p>
                      <p>{Math.round(match3MinData?.data?.medium?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>5 Min</h4>
                      <p>{match5MinData?.mediumMatches || 0}</p>
                      <p>{Math.round(match5MinData?.data?.medium?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match5MinData?.data?.medium?.avgacc) || 0} %</p>
                      <p>{Math.round(match5MinData?.data?.medium?.avgconsis) || 0} %</p>
                    </div>
                  </div>
                </NavLink>
                <NavLink to={`/admin/users/matches/${'hard'}`}>
                  <div className="stacs">
                    <div>
                      <h4>Hard Level</h4>
                      <p>Total Test</p>
                      <p>Average WPM</p>
                      <p>Average Accuracy</p>
                      <p>Average Consistency</p>
                    </div>
                    <div>
                      <h4>1 Min</h4>
                      <p>{match1MinData?.hardMatches || 0}</p>
                      <p>{Math.round(match1MinData?.data?.hard?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match1MinData?.data?.hard?.avgacc) || 0} %</p>
                      <p>{Math.round(match1MinData?.data?.hard?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>3 Min</h4>
                      <p>{match3MinData?.hardMatches || 0}</p>
                      <p>{Math.round(match3MinData?.data?.hard?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match3MinData?.data?.hard?.avgacc) || 0} %</p>
                      <p>{Math.round(match3MinData?.data?.hard?.avgconsis) || 0} %</p>
                    </div>
                    <div>
                      <h4>5 Min</h4>
                      <p>{match5MinData?.hardMatches || 0}</p>
                      <p>{Math.round(match5MinData?.data?.hard?.avgwpm) || 0} Per Min</p>
                      <p>{Math.round(match5MinData?.data?.hard?.avgacc) || 0} %</p>
                      <p>{Math.round(match5MinData?.data?.hard?.avgconsis) || 0} %</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <UpdatePassModal props={{ state : 'isEmpty', username : rawUserData?.username }} />
      <DeleteUserModal props={rawUserData?.username} />
    </>
  )
}

export default UserDetail