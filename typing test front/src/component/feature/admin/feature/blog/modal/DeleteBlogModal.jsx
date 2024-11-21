import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ButtonLoader from '../../../../../shared/loader/ButtonLoader'
import { handleDeleteBlogPost } from '../../../../../../redux/AdminDataSlice';
import { dynamicToast } from '../../../../../shared/Toast/DynamicToast';

const DeleteBlogModal = (props) => {

    const clsModal = useRef();
    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled) 
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg) 
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing) 
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg) 
    const [isLoading, setIsLoading] = useState(false)

    const deleteConfirmation = () =>{
        dispatch(handleDeleteBlogPost(props.props))
    }

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === 'blogDelete') {
                setIsLoading(false)
                dynamicToast({ message: 'Blog Deleted Successfully!', icon: 'success' });
                clsModal.current.click();
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === 'blogDelete') {
                setIsLoading(true)
            }
        }
    }, [isProcessing, processingMsg])




    return (
    <>
        <div
        className="modal fade"
        id="deleteblog"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="deleteblog"
        aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-popup">
                    <div className="modal-body p-30">
                        <div className='pass-modal'>
                            <div className='pass-header'>
                                <h4 className='font-active'>Are You Sure You Want to Delete This Blog ?</h4>
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
                                            isLoading ? (<ButtonLoader props={'Deleting'} />) : 'Delete'
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

export default DeleteBlogModal