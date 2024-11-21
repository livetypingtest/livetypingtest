import { Navigate, useRoutes } from 'react-router-dom'
import AdminModule from '../modules/AdminModule'
import adminRoutes from '../config/Admin/AdminRoutes'
// import Testing from '../component/feature/Testing' 
import AdminSignin from '../component/feature/auth/AdminSignin'

const AllRoutes = () => {

    const isAdminTokenPresent = () => {
        const token = localStorage.getItem('adminToken')
        if(token) {
            return true
        } else {
            return false
        }
    }

    const allRoutes = useRoutes([
        // {
        //     path : '/',
        //     element : <Testing />
        // },
        {
            path : '/',
            element : isAdminTokenPresent() ? (
                <Navigate to='/' replace />
            ) : (<AdminSignin />)
        },
        {
            path : '/signin',
            element : isAdminTokenPresent() ? (
                <Navigate to='/' replace />
            ) : (<AdminSignin />)
        },
        {
            path : '/admin',
            element :(<AdminModule />),
            children : adminRoutes
        }
    ])
    
    return allRoutes
}

export default AllRoutes