import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleBlockUnblockUser, handleGetUser, resetState, handleUploadProfile } from "../../../../redux/AdminDataSlice";
import { NavLink, useParams } from "react-router-dom";
import DeleteUserModal from "../modals/DeleteUserModal";
import { dynamicToast } from "../../../shared/Toast/DynamicToast";
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
        if(processingMsg?.type === 'profile') {
          setLoader({state : true, for : 'profile'})
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
        if(fullFillMsg?.type === 'profile') {
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
            setImagePath(rawUserData?.profileimage?.s3url)
        }
    }, [rawUserData])
    

    const blockUser = () =>{
      dispatch(handleBlockUnblockUser(rawUserData?.username))
    }

    

  return (
    <>
      
      <section>
        <div className="container pt-7">
          <div className="row">
            <div className="col-md-12">
              <div className="profile-card my-4">
                <div className="sec-1">
                  <div className="profile-img">
                    <img src={imagePath ? `${imagePath}` : "/assets/images/profile.png"}  alt="" />
                    <button className="btn" onClick={()=>profileRef?.current?.click()}><i class="fa-solid fa-upload cs-color-dark"></i></button>
                    {
                      loader.state && loader.for === 'profile' && (<div className="profile-loader"><i className="fa-duotone fa-solid fa-loader fa-spin-pulse fa-2xl" style={{color : '#fff'}} /></div>)
                    }
                    <input type="file" ref={profileRef} onChange={(event)=>{handleFileChange(event)}} style={{display : 'none'}} />
                  </div>
                  <div className="profile-data">
                    <h1>{rawUserData?.username}</h1>
                    <h6>Joined on: {formattedDate}</h6>
                    <span>User</span>
                  </div>
                </div>
                <div className="profile-btn">
                  {
                    loader.useState && loader.for === 'block-unblock' ? (<i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#71CAC7" }} />) : null
                  }
                  {
                    rawUserData?.isblock ? (
                      <button onClick={blockUser} className=" btn btn-success">Unblock User</button>
                    ) : (
                      <button onClick={blockUser} className=" btn btn-primary">Block User</button>
                    )
                  }
                  <button data-bs-toggle="modal" data-bs-target="#deleteaccount" className="p-0 btn text-danger">Delete Account</button>
                </div>
              </div>
              <div className="profile-card data my-4">
                <div className="profile-head">
                  <h1>Personal Information</h1>
                </div>
                <div className="width-100">
                  <div className="profile-content">
                    <div>
                      <label>Username</label>
                      <h6>{rawUserData?.username}</h6>
                    </div>
                    <div>
                      <label>Account ID</label>
                      <h6>{rawUserData?.accountid}</h6>
                    </div>
                    <div>
                      <label>Email ID</label>
                      <h6>{rawUserData?.email}</h6>
                    </div>
                    <div>
                      <label>Joined </label>
                      <h6>{formattedDate}</h6>
                    </div>
                    <div>
                      <label>Role</label>
                      <h6>User</h6>
                    </div>
                    <div>
                      <label>Password</label> <br />
                        <button className="btn" type="button" data-bs-toggle="modal" data-bs-target="#updatepassword">
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-card data my-4">
                <div className="profile-head">
                  <h1>Test Statistics</h1>
                </div>
                <div className="profile-content">
                  <div>
                    <label>Test Started</label>
                    <h2>{totalMatchesCompleted}</h2>
                  </div>
                  {/* <div>
                    <label>Test Completed</label>
                    <h2>26</h2>
                  </div> */}
                  <div>
                    <label>Time Typing</label>
                    <h2>{totalTimeOfMatches}</h2>
                  </div>
                </div>
              </div>
              <NavLink to={`/admin/users/matches/${'easy'}`}>
                <div className="profile-card my-4">
                  <div className="profile-content width-100">
                  <table className='width-100'>
                      <thead>
                        <tr>
                          <th>Easy Level</th>
                          <th>1 Min</th>
                          <th>3 Min</th>
                          <th>5 Min</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Test</td>
                          <td>{match1MinData?.easyMatches || 0}</td>
                          <td>{match3MinData?.easyMatches || 0}</td>
                          <td>{match5MinData?.easyMatches || 0}</td>
                        </tr>
                        <tr>
                          <td>Average WPM</td>
                          <td>{Math.round(match1MinData?.data?.easy?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match3MinData?.data?.easy?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match5MinData?.data?.easy?.avgwpm) || 0} Per Min</td>
                        </tr>
                        <tr>
                          <td>Average Accuracy</td>
                          <td>{Math.round(match1MinData?.data?.easy?.avgacc) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.easy?.avgacc) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.easy?.avgacc) || 0} %</td>
                        </tr>
                        <tr>
                          <td>Average Consistency</td>
                          <td>{Math.round(match1MinData?.data?.easy?.avgconsis) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.easy?.avgconsis) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.easy?.avgconsis) || 0} %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </NavLink>
              <NavLink to={`/admin/users/matches/${'medium'}`}>
                <div className="profile-card my-4">
                  <div className="profile-content width-100">
                  <table className='width-100'>
                      <thead>
                        <tr>
                          <th>Medium Level</th>
                          <th>1 Min</th>
                          <th>3 Min</th>
                          <th>5 Min</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Test</td>
                          <td>{match1MinData?.mediumMatches || 0}</td>
                          <td>{match3MinData?.mediumMatches || 0}</td>
                          <td>{match5MinData?.mediumMatches || 0}</td>
                        </tr>
                        <tr>
                          <td>Average WPM</td>
                          <td>{Math.round(match1MinData?.data?.medium?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match3MinData?.data?.medium?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match5MinData?.data?.medium?.avgwpm) || 0} Per Min</td>
                        </tr>
                        <tr>
                          <td>Average Accuracy</td>
                          <td>{Math.round(match1MinData?.data?.medium?.avgacc) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.medium?.avgacc) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.medium?.avgacc) || 0} %</td>
                        </tr>
                        <tr>
                          <td>Average Consistency</td>
                          <td>{Math.round(match1MinData?.data?.medium?.avgconsis) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.medium?.avgconsis) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.medium?.avgconsis) || 0} %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </NavLink>
              <NavLink to={`/admin/users/matches/${'hard'}`}>
                <div className="profile-card my-4">
                  <div className="profile-content width-100">
                  <table className='width-100'>
                      <thead>
                        <tr>
                          <th>Hard Level</th>
                          <th>1 Min</th>
                          <th>3 Min</th>
                          <th>5 Min</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Test</td>
                          <td>{match1MinData?.hardMatches || 0}</td>
                          <td>{match3MinData?.hardMatches || 0}</td>
                          <td>{match5MinData?.hardMatches || 0}</td>
                        </tr>
                        <tr>
                          <td>Average WPM</td>
                          <td>{Math.round(match1MinData?.data?.hard?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match3MinData?.data?.hard?.avgwpm) || 0} Per Min</td>
                          <td>{Math.round(match5MinData?.data?.hard?.avgwpm) || 0} Per Min</td>
                        </tr>
                        <tr>
                          <td>Average Accuracy</td>
                          <td>{Math.round(match1MinData?.data?.hard?.avgacc) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.hard?.avgacc) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.hard?.avgacc) || 0} %</td>
                        </tr>
                        <tr>
                          <td>Average Consistency</td>
                          <td>{Math.round(match1MinData?.data?.hard?.avgconsis) || 0} %</td>
                          <td>{Math.round(match3MinData?.data?.hard?.avgconsis) || 0} %</td>
                          <td>{Math.round(match5MinData?.data?.hard?.avgconsis) || 0} %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </section>
      <UpdatePassModal props={{ state : 'isEmpty', username : rawUserData?.username }} />
      <DeleteUserModal props={rawUserData?.username} />
    </>
  )
}

export default UserDetail