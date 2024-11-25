import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { handleLocalDataCalling } from '../redux/UserDataSlice';
import { handleGetAboutData, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';
import useDynamicTitle from '../component/shared/dynamicTitle/useDynamicTitle';

const RootModule = () => {

    // useDynamicTitle()
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])
    
    return (
        <Outlet />
    )
}

export default RootModule