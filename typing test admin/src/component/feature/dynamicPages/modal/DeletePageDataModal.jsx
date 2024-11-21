import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ButtonLoader from '../../../shared/loader/ButtonLoader'
import { dynamicToast } from '../../../shared/Toast/DynamicToast';
import { handleDeleteAbout, handleDeletePrivacyData, handleDeleteTermData } from '../../../../redux/DynamicPagesDataSlice';

const DeletePageDataModal = (props) => {

    const clsModal = useRef();
    const {page} = props
    const dispatch = useDispatch();
    const isFullfilled = useSelector(state => state.DynamicPagesDataSlice.isFullfilled) 
    const fullFillMsg = useSelector(state => state.DynamicPagesDataSlice.fullFillMsg) 
    const isProcessing = useSelector(state => state.DynamicPagesDataSlice.isProcessing) 
    const processingMsg = useSelector(state => state.DynamicPagesDataSlice.processingMsg) 
    const [isLoading, setIsLoading] = useState(false)
    const getState = {
        'privacy' : 'privacyPolicy',
        'term' : 'termsCondition',
        'about' : 'aboutDeleteMany'
    }
    const getMsgForToast = {
        'privacy' : 'Privacy & Policy',
        'term' : 'Terms & Condition',
        'about' : 'About Us'
    }

    const deleteConfirmation = () =>{
        if(page === 'term') {
            dispatch(handleDeleteTermData())
        } else if(page === 'privacy') {
            dispatch(handleDeletePrivacyData())
        } else if(page === 'about') {
            dispatch(handleDeleteAbout())
        } else return
    }

    useEffect(()=>{
        if(isFullfilled) {
            if(fullFillMsg?.type === getState[page]) {
                setIsLoading(false)
                dynamicToast({ message: `${getMsgForToast[page]} Deleted Successfully!`, icon: 'success' });
                clsModal.current.click();
            }
        }
    }, [isFullfilled, fullFillMsg])

    useEffect(()=>{
        if(isProcessing) {
            if(processingMsg?.type === getState[page]) {
                setIsLoading(true)
            }
        }
    }, [isProcessing, processingMsg])




    return (
    <>
        <div
        className="modal fade"
        id="deletepagedata"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="deletepagedata"
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
                                    className="btn"
                                    data-bs-dismiss="modal"
                                    ref={clsModal}
                                    >
                                        Close
                                    </button>
                                    <button  onClick={deleteConfirmation} className="btn btn-danger">
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

export default DeletePageDataModal