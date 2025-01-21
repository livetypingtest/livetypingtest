import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { handleLocalDataCalling, resetState } from '../redux/UserDataSlice';
import { handleGetAboutData, handleGetNotice, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader';

const RootModule = () => {

    // useDynamicTitle()
    const dispatch = useDispatch();

        const [pageLoader, setPageLoader] = useState(false)

    const isDataPending = useSelector(state => state.UserDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)

    useEffect(()=>{
            if(isDataPending) {
                setPageLoader(true)
                dispatch(resetState())
            }
    }, [isDataPending])
    
    useEffect(()=>{
        if(isFullfilled) {
            setPageLoader(false)
            dispatch(resetState())
        }
    }, [isFullfilled])

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])
    useEffect(()=>{dispatch(handleGetNotice())}, [])

    useEffect(()=>{console.log(pageLoader)}, [pageLoader])

    
    return (
        <>
            <Outlet />
            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default RootModule