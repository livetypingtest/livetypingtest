import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { handleLocalDataCalling } from '../redux/UserDataSlice';
import { handleGetAboutData, handleGetNotice, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';

const RootModule = () => {

    // useDynamicTitle()
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])
    useEffect(()=>{dispatch(handleGetNotice())}, [])

    
    return (
        <Outlet />
    )
}

export default RootModule