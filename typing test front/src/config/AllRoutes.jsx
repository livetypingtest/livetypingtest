import { Navigate, useRoutes } from 'react-router-dom'
import RootModule from '../modules/RootModule'
import AdminModule from '../modules/AdminModule'
import UserModule from '../modules/UserModule'
import rootRoutes from '../config/Root/RootRoutes'
import adminRoutes from '../config/Admin/AdminRoutes'
import userRoutes from '../config/User/UserRoutes'
import UserAuth from '../component/feature/user/feature/auth/UserAuth'
import AdminSignin from '../component/feature/admin/feature/auth/AdminSignin'

const AllRoutes = () => {

    const isUserTokenPresent = () => {
        const token = localStorage.getItem('userToken')
        if(token) {
            return true
        } else {
            return false
        }
    }

    // const isAdminTokenPresent = () => {
    //     const token = localStorage.getItem('adminToken')
    //     if(token) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    const allRoutes = useRoutes([
        // {
        //     path : '/',
        //     element : isAdminTokenPresent() ? (
        //         <Navigate to='/admin' replace />
        //     ) : (<RootModule />),
        //     children : rootRoutes
        // },
        {
            path: '/',
            element: isUserTokenPresent() ? (
                <UserModule />
            ) : (
                <RootModule />
            ),
            children: isUserTokenPresent() ? userRoutes : rootRoutes
        },
        {
            path : '/signin',
            element : isUserTokenPresent() ? (
                <Navigate to='/user' replace />
            ) : (<UserAuth />)
        },
        {
            path : '/signup',
            element : isUserTokenPresent() ? (
                <Navigate to='/user' replace />
            ) : (<UserAuth />)
        },
        // {
        //     path : '/adminsignin',
        //     element : isUserTokenPresent() ? (
        //         <Navigate to='/user' replace />
        //     ) : isAdminTokenPresent() ? (<Navigate to='/admin' />) : (<AdminSignin />)
        // },
        // {
        //     path : '/admin',
        //     element :(<AdminModule />),
        //     children : adminRoutes
        // },
        // {
        //     path : '/user',
        //     element : (<UserModule />),
        //     children : userRoutes
        // },
    ])
    
    return allRoutes
}

export default AllRoutes