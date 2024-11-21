import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetLeaderboardData, resetState } from '../../../redux/UserDataSlice';
import { NavLink } from 'react-router-dom';
import { BASE_API_URL } from '../../../util/API_URL';


const LeaderBoard = () => {

    const dispatch = useDispatch();
    const [onLoadLimit, setOnLoadLimit] = useState(50)
    const rawAllUserData = useSelector(state => state.UserDataSlice.allUserData)
    const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
    const processingMsg = useSelector(state => state.UserDataSlice.processingMsg)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
    const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
    const [isLoading, setIsLoading] = useState(false)
    const [displayData, setDisplayData] = useState([])
    const [timeFilter, setTimeFilter] = useState('1')
    const [levelFilter, setLevelFilter] = useState('all')

    useEffect(() => {
        if (rawAllUserData) {
            setDisplayData(rawAllUserData?.map(value => {return {username : value.username, profile : value.profile.s3url, avgAcc : value?.overall?.avgAcc, avgWpm : value?.overall?.avgWpm, avgConsis : value?.overall?.avgConsis}}))
            // console.log(rawAllUserData)  
        }
    }, [rawAllUserData]);
    
    useEffect(()=>{
        // console.log(displayData)
        
    }, [displayData])
    
    const handleFilterTime = (time) =>{
        setTimeFilter(time)
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : time
        }
        dispatch(handleGetLeaderboardData(obj))
    }

    const updateDataOnLevels = () => {
        const getFilteredData = (level) => {
            switch (level) {
                case 'easy':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        profile: value.profile.newname,
                        avgAcc: value?.levels?.easy?.avgAcc,
                        avgWpm: value?.levels?.easy?.avgWpm,
                        avgConsis: value?.levels?.easy?.avgConsis
                    }));
                case 'medium':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        profile: value.profile.newname,
                        avgAcc: value?.levels?.medium?.avgAcc,
                        avgWpm: value?.levels?.medium?.avgWpm,
                        avgConsis: value?.levels?.medium?.avgConsis
                    }));
                case 'hard':
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        profile: value.profile.newname,
                        avgAcc: value?.levels?.hard?.avgAcc,
                        avgWpm: value?.levels?.hard?.avgWpm,
                        avgConsis: value?.levels?.hard?.avgConsis
                    }));
                case 'all':
                default:
                    return rawAllUserData?.map(value => ({
                        username: value.username,
                        profile: value.profile.newname,
                        avgAcc: value?.overall?.avgAcc,
                        avgWpm: value?.overall?.avgWpm,
                        avgConsis: value?.overall?.avgConsis
                    }));
            }
        };
    
        // Get filtered data for the selected level
        const filteredData = getFilteredData(levelFilter);
    
        // Sort the data based on avgWpm, avgConsis, and avgAcc
        const rankedData = filteredData
            ?.filter(item => item.avgWpm && item.avgConsis && item.avgAcc) // Ensure valid data
            .sort((a, b) => {
                if (b.avgWpm !== a.avgWpm) return b.avgWpm - a.avgWpm; // Primary: avgWpm
                if (b.avgConsis !== a.avgConsis) return b.avgConsis - a.avgConsis; // Secondary: avgConsis
                return b.avgAcc - a.avgAcc; // Tertiary: avgAcc
            });
    
        // Update the display data
        setDisplayData(rankedData);
    };
    

    useEffect(()=>{
        updateDataOnLevels()
    }, [timeFilter, levelFilter])

    const handleFilterLevel = (level) =>{
        setLevelFilter(level)
    }

    useEffect(()=>{
        const obj = {
            onLoadLimit : onLoadLimit,
            timeFilter : timeFilter
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

        <section>
            <div className="container pt-7">
                <div className="row">
                    <div className="col-md-12">
                        <div className="stac-head">
                            <h2>All-Time Leaderboards  </h2>
                            <div className="filter">
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterTime('1')} className={'btn btn-outline-primary '+(timeFilter === '1' ? 'active' : '')}>01 Min</button>
                                    <button onClick={()=>handleFilterTime('3')} className={'btn btn-outline-primary '+(timeFilter === '3' ? 'active' : '')}>03 Min</button>
                                    <button onClick={()=>handleFilterTime('5')} className={'btn btn-outline-primary '+(timeFilter === '5' ? 'active' : '')}>05 Min</button>
                                </div>
                            </div>
                            <div className="filter">
                                <div className="filter-btn">
                                    <button onClick={()=>handleFilterLevel('all')} className={'btn btn-outline-primary '+(levelFilter === 'all' ? 'active' : '')}>All</button>
                                    <button onClick={()=>handleFilterLevel('easy')} className={'btn btn-outline-primary '+(levelFilter === 'easy' ? 'active' : '')}>Easy</button>
                                    <button onClick={()=>handleFilterLevel('medium')} className={'btn btn-outline-primary '+(levelFilter === 'medium' ? 'active' : '')}>Medium</button>
                                    <button onClick={()=>handleFilterLevel('hard')} className={'btn btn-outline-primary '+(levelFilter === 'hard' ? 'active' : '')}>Hard</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="show-filter py-2">
                            <h3 className="font-active text-left">0{timeFilter} Min {levelFilter} Mode</h3>
                            {isLoading && (
                                <div className="rl-loading-container">
                                    <div className="rl-loading-thumb rl-loading-thumb-1"></div>
                                    <div className="rl-loading-thumb rl-loading-thumb-2"></div>
                                    <div className="rl-loading-thumb rl-loading-thumb-3"></div>
                                </div>
                            )}
                        </div>
                        <div className="alluser-table my-3">
                            <table className="table table-dark m-0 table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>name</th>
                                        <th>wpm</th>
                                        <th>accuracy</th>
                                        <th>consistency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayData?.map((value, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <NavLink to={`/admin/users/${value.username}`}>
                                                    <div className="profile">
                                                        <img src={value?.profile || "/assets/images/profile.png"} alt="" />
                                                        {value?.username}
                                                        {/* Show badges based on the index, after the username */}
                                                        {index + 1 === 1 && <span className="badge-icon cs">🥇</span>}
                                                        {index + 1 === 2 && <span className="badge-icon cs">🥈</span>}
                                                        {index + 1 === 3 && <span className="badge-icon cs">🥉</span>}
                                                    </div>
                                                </NavLink>
                                            </td>
                                            <td>{Math.round(value?.avgWpm)}</td>
                                            <td>{Math.round(value?.avgAcc)}</td>
                                            <td>{Math.round(value?.avgConsis)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>



    </>
  )
}

export default LeaderBoard