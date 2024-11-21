import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { handleGetAdminData, resetState } from '../redux/AdminDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader'


const AdminModule = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageLoader, setPageLoader] = useState(false)
    const isDataPending = useSelector(state => state.AdminDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled)

    useEffect(()=>{
        if(!localStorage.getItem('adminToken')) {
            navigate(`/`)
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

    return (
        <>
            <Outlet />
            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default AdminModule