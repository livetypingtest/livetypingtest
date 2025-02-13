import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetLeaderboardData, resetState } from '../../../redux/UserDataSlice';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { BASE_API_URL } from '../../../util/API_URL';
import MetaUpdater from '../../../util/MetaUpdater';
import { useLocation } from 'react-router-dom';
import DynamicTitle from '../helmet/DynamicTitle';
import { profileExtractor } from '../../../util/Extractor';


const LeaderBoard = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const [onLoadLimit, setOnLoadLimit] = useState(50)
    const rawAllUserData = useSelector(state => state.UserDataSlice.allUserData)
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
    const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
    const [isLoading, setIsLoading] = useState(false)
    const [displayData, setDisplayData] = useState([])
    const [timeFilter, setTimeFilter] = useState('1')
    const [tooltipActive, setTooltipActive] = useState('1')
    const [levelFilter, setLevelFilter] = useState('all')

    useEffect(() => {
        if (rawAllUserData) {
            setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile?.display === 'empty' ? '/assets/images/profile.png' : value.profile?.[profileExtractor[value.profile?.display]], avgAcc : value?.overall?.avgAcc, avgWpm : value?.overall?.avgWpm, avgConsis : value?.overall?.avgConsis, points: value?.overall?.points}}))
            // console.log(rawAllUserData)  
            // rawAllUserData?.map(value => console.log(value?.username + ":" +value.profile?.googleProfile))
        }
    }, [rawAllUserData]);
    
    useEffect(()=>{
        // console.log(displayData)
        
    }, [displayData])
    
    const handleFilterTime = (time) =>{
        setTimeFilter(time)
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : time,
            level : levelFilter
        }
        dispatch(handleGetLeaderboardData(obj))
    }

    const handleFilterLevel = (level) =>{
        setLevelFilter(level)
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : timeFilter,
            level : level
        }
        dispatch(handleGetLeaderboardData(obj))
    }
    // const handleFilterLevel = (level) =>{
    //     setLevelFilter(level)
    // }

    const updateDataOnLevels = () => {
        const getFilteredData = (level) => {
            switch (level) {
                case 'easy':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        points: value?.levels?.easy?.points,
                        profile : value.profile?.display === 'empty' ? '/assets/images/profile.png' : value.profile?.[profileExtractor[value.profile?.display]],
                        avgAcc: value?.levels?.easy?.avgAcc,
                        avgWpm: value?.levels?.easy?.avgWpm,
                        avgConsis: value?.levels?.easy?.avgConsis
                    }));
                case 'medium':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        points: value?.levels?.medium?.points,
                        profile : value.profile?.display === 'empty' ? '/assets/images/profile.png' : value.profile?.[profileExtractor[value.profile?.display]],
                        avgAcc: value?.levels?.medium?.avgAcc,
                        avgWpm: value?.levels?.medium?.avgWpm,
                        avgConsis: value?.levels?.medium?.avgConsis
                    }));
                case 'hard':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        points: value?.levels?.hard?.points,
                        profile : value.profile?.display === 'empty' ? '/assets/images/profile.png' : value.profile?.[profileExtractor[value.profile?.display]],
                        avgAcc: value?.levels?.hard?.avgAcc,
                        avgWpm: value?.levels?.hard?.avgWpm,
                        avgConsis: value?.levels?.hard?.avgConsis
                    }));
                case 'all':
                default:
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        points: value?.overall?.points,
                        profile : value.profile?.display === 'empty' ? '/assets/images/profile.png' : value.profile?.[profileExtractor[value.profile?.display]],
                        avgAcc: value?.overall?.avgAcc,
                        avgWpm: value?.overall?.avgWpm,
                        avgConsis: value?.overall?.avgConsis
                    }));
            }
        };
    
        // Get filtered data for the selected level
        const filteredData = getFilteredData(levelFilter);
    
        // // Sort the data based on avgWpm, avgConsis, and avgAcc
        // const rankedData = filteredData
        //     ?.filter(item => item.avgWpm && item.avgConsis && item.avgAcc) // Ensure valid data
        //     .sort((a, b) => {
        //         if (b.avgWpm !== a.avgWpm) return b.avgWpm - a.avgWpm; // Primary: avgWpm
        //         if (b.avgConsis !== a.avgConsis) return b.avgConsis - a.avgConsis; // Secondary: avgConsis
        //         return b.avgAcc - a.avgAcc; // Tertiary: avgAcc
        //     });
    
        // // Update the display data
        // setDisplayData(rankedData);

    setDisplayData(filteredData?.filter(user => user.points > 0)?.sort((a, b) => b.points - a.points)); // Update the display data
    };


    useEffect(()=>{
        // updateDataOnLevels()
    }, [timeFilter, levelFilter])

    useEffect(()=>{
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : timeFilter,
            level : levelFilter
        }
        dispatch(handleGetLeaderboardData(obj))
    }, [])

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'leaderboard'){
                setIsLoading(false)
                dispatch(resetState())
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'leaderboard') {
                setIsLoading(true)
                dispatch(resetState())
            }
        }
    }, [isProcessing, processingMsg])

  return (
    <>
        <DynamicTitle title={"Live Typing Test | Leaderboard"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Leaderboard"}  />
        <Header />

        <section>
            <div className="container py-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="leaderboard-head">
                            <h1>All-Time Leaderboards  </h1>
                            <div className="filter">
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterTime('1')} className={timeFilter === '1' ? 'active' : ''}>01 Min</button>
                                    <button onClick={()=>handleFilterTime('3')} className={timeFilter === '3' ? 'active' : ''}>03 Min</button>
                                    <button onClick={()=>handleFilterTime('5')} className={timeFilter === '5' ? 'active' : ''}>05 Min</button>
                                </div>
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterLevel('all')} className={levelFilter === 'all' ? 'active' : ''}>All</button>
                                    <button onClick={()=>handleFilterLevel('easy')} className={levelFilter === 'easy' ? 'active' : ''}>Easy</button>
                                    <button onClick={()=>handleFilterLevel('medium')} className={levelFilter === 'medium' ? 'active' : ''}>Medium</button>
                                    <button onClick={()=>handleFilterLevel('hard')} className={levelFilter === 'hard' ? 'active' : ''}>Hard</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div className="container p-custom">
                <div className="row">
                    <div className="col-md-12">
                        <div className="show-filter py-2">
                            <h1 className='font-active text-left cs-tooltip-container'>
                                0{timeFilter} Min {levelFilter} Mode  &nbsp;
                                <span onMouseEnter={()=>{document.getElementById('cs-tooltip').classList.add('active')}} onMouseLeave={()=>{document.getElementById('cs-tooltip').classList.remove('active')}}><i className="fa-regular fa-circle-info"></i></span> 
                                <div id="cs-tooltip" className="cs-tooltip">
                                    <div className="layout">
                                        <p className='font-active fs-14'>Points are awarded based on the number of matches played. Each game contributes a specific number of points, which determine your ranking on the leaderboard. (Minimun 10 matches to be played)</p>
                                    </div>
                                </div>
                            </h1>
                            {
                                isLoading && (<div class="rl-loading-container">
                                    <div class="rl-loading-thumb rl-loading-thumb-1"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-2"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-3"></div>
                                </div>)
                            }
                        </div>
                        <div className="leaderboard-table my-3">
                            <table className="">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>name</th>
                                    <th>Score</th>
                                    {/* <th>wpm</th>
                                    <th>accuracy</th>
                                    <th>consistency</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        displayData?.length !== 0 ? displayData?.map((value, index) => (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td><div className='profile'><img src={value?.profile}  alt="" />
                                                    <p className='leaderboard-profile-font'>{value?.username}</p>
                                                    {/* Show badges based on the index, after the username */}
                                                    {index + 1 === 1 && <span className="badge-icon cs">🥇</span>}
                                                    {index + 1 === 2 && <span className="badge-icon cs">🥈</span>}
                                                    {index + 1 === 3 && <span className="badge-icon cs">🥉</span>}
                                                </div></td>
                                                <td><p className="leaderboard-profile-font">{Math.round(value?.points)}</p></td>
                                                {/* <td><p className="leaderboard-profile-font">{Math.round(value?.avgWpm)}</p></td>
                                                <td><p className="leaderboard-profile-font">{Math.round(value?.avgAcc)}</p></td>
                                                <td><p className="leaderboard-profile-font">{Math.round(value?.avgConsis)}</p></td> */}
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                                <td>No Match Played</td>
                                                {/* <td>No Match Played</td> */}
                                                {/* <td>No Match Played</td> */}
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />

        
    </>
  )
}

export default LeaderBoard