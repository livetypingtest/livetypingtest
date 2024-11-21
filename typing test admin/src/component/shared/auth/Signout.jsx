import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { handleClearState } from '../../../redux/UserDataSlice';

const Signout = () => {

    localStorage.clear();
    const dispatch = useDispatch();
    const param = useParams();

    useEffect(()=>{
      dispatch(handleClearState());
      localStorage.setItem(param.type, true)
    }, [])

  return (
    <Navigate to='/' />
  )
}

export default Signout