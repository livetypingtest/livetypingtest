import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetAdminData, resetState } from '../redux/AdminDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader'
import SideBar from '../component/shared/header/SideBar';
import Header from '../component/shared/header/Header';
import { handleGetAboutData, handleGetContactData, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';


const AdminModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageLoader, setPageLoader] = useState(false)
    const isDataPending = useSelector(state => state.AdminDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled)

    useEffect(()=>{
        if(!localStorage.getItem('adminToken')) {
            navigate(`/signin`)
        }
    }, [])

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
        const ID = localStorage.getItem('adminToken')
        dispatch(handleGetAdminData(ID))
    }, [])

    useEffect(()=>{
        dispatch(handleGetTermData())
    }, [])

    useEffect(()=>{
        dispatch(handleGetAboutData())
    }, [])

    useEffect(()=>{
        dispatch(handleGetContactData())
    }, [])

    return (
        <>

        <div
            className="page-wrapper"
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            {/* Sidebar Start */}
            <SideBar />
            {/*  Sidebar End */}
            {/*  Main wrapper */}
            <div className="body-wrapper">
                {/*  Header Start */}
                
                <Header />
                {/*  Header End */}
                
                <Outlet />
                
            </div>
        </div>

            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default AdminModule