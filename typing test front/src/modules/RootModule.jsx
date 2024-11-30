import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { handleLocalDataCalling } from '../redux/UserDataSlice';
import { handleGetAboutData, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';
import useDynamicTitle from '../component/shared/dynamicTitle/useDynamicTitle';
import updateSitemap from '../../public/script/updateSitemap';

const RootModule = () => {

    // useDynamicTitle()
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])

    const blogData = useSelector(state => state.UserDataSlice.blog)
    let urls = []

    useEffect(()=>{
        blogData.map(value => urls.push(`https://livetypingtest.com/blog/${value.permalink}`))
    }, [blogData])

    useEffect(()=>{
        if(urls?.length !== 0) {
            updateSitemap(urls)
        }
    }, [urls])
    
    return (
        <Outlet />
    )
}

export default RootModule