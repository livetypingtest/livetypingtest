import { useEffect } from "react";
import { dynamicToast } from "../../../../shared/Toast/DynamicToast";
import Header from "../../../../shared/header/Header";


const AdminDashBoard = () => {

  useEffect(()=>{
    if(localStorage.getItem('isSignin')) {
      dynamicToast({ message: 'Logged in Successfully!', icon: 'success' });
      setTimeout(()=>{
        localStorage.removeItem('isSignin')
      }, 3500)
    }
  },[])

  return (
    <>
      <Header />
    </>
  )
}

export default AdminDashBoard