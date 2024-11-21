import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleDeleteUserAccount } from '../../../../../../redux/AdminDataSlice';
import { dynamicToast } from '../../../../../shared/Toast/DynamicToast';

const DeleteUserModal = (props) => {

    const clsModal = useRef();
    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled) 
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg) 
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing) 
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg) 
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const deleteConfirmation = () =>{
        dispatch(handleDeleteUserAccount(props.props))
    }

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'delete') {
                dynamicToast({ message: "Account Deleted Successfully", icon: "info" });
                clsModal.current.click();
                setIsLoading(false)
                setTimeout(()=>{
                    navigate(`/admin/users`)
                },10)
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'delete') {
                setIsLoading(true)
            }
        }
    }, [isProcessing, processingMsg])




    return (
    <>
        <div
        className="modal fade"
        id="deleteaccount"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="deleteaccount"
        aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body p-30">
                        <div className='pass-modal'>
                            <div className='pass-header'>
                                <h4 className='font-active'>Are You Sure You Want to Delete Your Account ?</h4>
                            </div>
                                {/* <div className="pass-body my-4">
                                    
                                </div> */}
                                <div className="pass-footer mt-4">
                                    <button
                                    type="button"
                                    className="theme-btn sm bg-idle"
                                    data-bs-dismiss="modal"
                                    ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button  onClick={deleteConfirmation} className="theme-btn-danger sm">
                                        {
                                            isLoading ? (<div class="wrapper-cs">
                                                <span class="text">
                                                    Deleting
                                                </span>
                                                <div class="dot-cs"></div>
                                                </div>) : 'Delete'
                                        }
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeleteUserModal