import { useEffect, useRef, useState } from 'react'
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UpdatePassModal from './UpdatePassModal'
import { handleUpdateUserProfile, resetState } from '../../../../../redux/UserDataSlice'
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'
import MetaUpdater from '../../../../../util/MetaUpdater'
import DeleteUserModal from './DeleteUserModal'
import DynamicTitle from '../../../../shared/helmet/DynamicTitle'
import { profileExtractor } from '../../../../../util/Extractor'
import ProfileUpdateModal from './ProfileUpdateModal'

const UserDashBoard = () => {

  const dispatch = useDispatch();

  const rawUserData = useSelector(state => state.UserDataSlice.userData) 
  const matches1Min = useSelector(state => state.UserDataSlice.match1) 
  const matches3Min = useSelector(state => state.UserDataSlice.match3) 
  const matches5Min = useSelector(state => state.UserDataSlice.match5) 
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled) 
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg) 
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing) 
  const processingMsg = useSelector(state => state.UserDataSlice.processingMsg) 

  const [formattedDate, setFormattedDate] = useState();
  const [totalMatchesCompleted, setTotalMatchesCompleted] = useState(0);
  const [totalTimeOfMatches, setTotalTimeOfMatches] = useState(0);
  const [match1MinData, setMatch1MinData] = useState([])
  const [match3MinData, setMatch3MinData] = useState([])
  const [match5MinData, setMatch5MinData] = useState([])
  const [imagePath, setImagePath] = useState('');
  const [loader, setLoader] = useState({state : false, for : ''})
  const [editableFields, setEditableFields] = useState({
    bio: false,
    twitter: false
  });
  const [formData, setFormData] = useState({
    bio: '',
    twitter: ''
  });


// for finding the total matches----------------------------------------------------
useEffect(()=>{
  console.log(rawUserData)
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
    updateMatchesData('match1')
    updateMatchesData('match3')
    updateMatchesData('match5')
  }, [rawUserData])
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
    if(isFullfilled) {
      if(fullFillMsg?.type === 'profile') {
        setLoader({state : false, for : ''})
        dynamicToast({ message: 'Updated successfully', timer: 3000, icon: 'success' })
        dispatch(resetState())
      }
      dispatch(resetState())
    }
  }, [ isFullfilled, fullFillMsg ])
  
  
  // handle upload profile------------------------------------------------------------------------------


  useEffect(() => {
  
    const whatDisplay = rawUserData?.profileimage?.display;
  
    if (whatDisplay && whatDisplay !== 'empty') {
      setImagePath(rawUserData?.profileimage?.[profileExtractor[whatDisplay]]);
    } else {
      setImagePath('empty');
    }
  }, [rawUserData]);
  
  // handle upload profile------------------------------------------------------------------------------

  useEffect(()=>{
    if(isProcessing) {
      if(processingMsg?.type === 'profile') {
        setLoader({state : true, for : 'profile'})
        dispatch(resetState())
      }
      
    }
  }, [ isProcessing, processingMsg ])

  // Initialize form data when rawUserData changes
  useEffect(() => {
    setFormData({
      bio: rawUserData?.bio || '',
      twitter: rawUserData?.url?.twitter || ''
    });
  }, [rawUserData]);

  const handleEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (field) => {
    try {
      if(field !== 'bio') {
        dispatch(handleUpdateUserProfile({ url: {[field]: formData[field]} }))
      } else {
        dispatch(handleUpdateUserProfile({[field]: formData[field]}))
      }
      

      setEditableFields(prev => ({
        ...prev,
        [field]: false
      }));
      
      // Show success toast
    } catch (error) {
      dynamicToast({ message: 'Failed to update', timer: 3000, icon: 'error' })
    }
  };


  return (
    <>
      <DynamicTitle title={"Live Typing Test | Profile"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Profile"}  />
      <Header />
      <section className='user-profile py-5'>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-layout">
                <div className="profile-sec1">
                  <div className='profile-upload-main'>
                    <img src={imagePath !== 'empty' ? `${imagePath}` : "/assets/images/profile.png"}  alt="" />
                    {
                      loader.state && loader.for === 'profile' && (<div className="profile-loader"><i className="fa-duotone fa-solid fa-loader fa-spin-pulse fa-2xl" style={{color : '#fff'}} /></div>)
                    }
                    <div className='profile-upload'><button data-bs-toggle='modal' data-bs-target='#profile'><i className="fa-regular fa-upload fa-xl" style={{ color: "#71cac7" }} /></button></div>
                  </div>
                  <div className='text-center mt-24'>
                    <h4 className='font-active m-0'>{rawUserData?.username}</h4>
                    <hp className='font-idle'>Joined {formattedDate ? formattedDate : null}</hp>
                  </div>
                </div>
                  <div className="profile-sec2">
                    {/* Name Input Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="Name">Name :</label>
                        {/* <button
                        type="submit"
                        >
                          <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button> */}
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
                        {/* <button
                        type="button"
                        >
                            <i className="fa-regular text-idle fa-pen-to-square"></i>
                        </button> */}
                      </div>
                      <input
                        name="email"
                        readOnly
                        value={rawUserData?.email}
                        type="email"
                        placeholder="Email ID"
                      />
                    </div>

                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="bio">Bio :</label>
                        {!editableFields.bio ? (
                          <button type="button" onClick={() => handleEdit('bio')}>
                            <i className="fa-regular text-idle fa-pen-to-square"></i>
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleSave('bio')}>
                            <i className="fa-regular text-idle fa-save"></i>
                          </button>
                        )}
                      </div>
                      <input
                        name="bio"
                        readOnly={!editableFields.bio}
                        value={editableFields.bio ? formData.bio : rawUserData?.bio || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Bio"
                      />
                    </div>

                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="twitter">Twitter :</label>
                        {!editableFields.twitter ? (
                          <button type="button" onClick={() => handleEdit('twitter')}>
                            <i className="fa-regular text-idle fa-pen-to-square"></i>
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleSave('twitter')}>
                            <i className="fa-regular text-idle fa-save"></i>
                          </button>
                        )}
                      </div>
                      {editableFields.twitter ? (
                        <input
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          type="url"
                          placeholder="Twitter URL"
                        />
                      ) : (
                        rawUserData?.url?.twitter ? (
                          <a 
                            href={rawUserData.url.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            {rawUserData.url.twitter}
                          </a>
                        ) : (
                          <input
                            readOnly
                            value=""
                            type="url"
                            placeholder="Twitter URL"
                          />
                        )
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="profile-input my-3">
                      <div>
                        <label htmlFor="password">Change Password :</label>
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
                  <NavLink to={`/signout/${'isSignout'}`} className="theme-btn width-100">Logout</NavLink>
                  <button data-bs-toggle="modal" data-bs-target="#deleteaccount" className="delete-btn">Delete Account</button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="profile-stacs">
                <div className="stacs">
                  <div>
                    <h4>Test Completed</h4>
                    <h2>{totalMatchesCompleted}</h2>
                  </div>
                  {/* <div>
                    <h4>Test Completed</h4>
                    <h2>26</h2>
                  </div> */}
                  <div>
                    <h4>Time Typing</h4>
                    <h2>{totalTimeOfMatches}</h2>
                  </div>
                </div>
                <NavLink to={`/matches/${'easy'}`}>
                  <div className="stacs mob">
                    <table className='width-80'>
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
                </NavLink>
                <NavLink to={`/matches/${'medium'}`}>
                  <div className="stacs mob">
                  <table className='width-80'>
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
                </NavLink>
                <NavLink to={`/matches/${'hard'}`}>
                  <div className="stacs mob">
                  <table className='width-80'>
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
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <UpdatePassModal props={rawUserData?.password ? 'notEmpty' : 'isEmpty'} />
      <ProfileUpdateModal googleProfileImage={rawUserData?.profileimage?.googleProfile} initialProfileImage={rawUserData?.profileimage?.s3url} type={rawUserData?.profileimage?.display} />
      <DeleteUserModal />
    </>
  )
}

export default UserDashBoard