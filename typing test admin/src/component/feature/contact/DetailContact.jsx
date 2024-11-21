import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { handleUpdateContactData } from "../../../redux/DynamicPagesDataSlice";
import axios from "axios";
import { BASE_API_URL } from "../../../util/API_URL";
import {dynamicToast} from '../../shared/Toast/DynamicToast'

const DetailContact = () => {

    const param = useParams();
    const {id} = param
    const [displayData, setDisplayData] = useState({})
    const [userReply, setUserReply] = useState(null)
    const [errMsg, setErrMsg] = useState({state: false, message: ''})
    const dispatch = useDispatch()

    const contactData = useSelector(state => state.DynamicPagesDataSlice.contact);
    
    useEffect(()=>{
        if(contactData) {
            setDisplayData(contactData?.filter(value => value._id === id)[0])
        }
    }, [contactData])

    useEffect(()=>{
        if(displayData && displayData?.status === "unseen") {
            dispatch(handleUpdateContactData(id))
        }
    }, [param, contactData, displayData])


    function formatDate(timestamp) {
        // Check if timestamp is valid and parseable
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return "Invalid Date"; // Return default if timestamp is invalid
        }
    
        // Format time as '12:48pm'
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const time = new Intl.DateTimeFormat('en-US', options).format(date);
    
        // Format date as '13Oct 2024'
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
    
        return `${time} ${day}${month} ${year}`;
    }

    const handleSendReply = async() => {
        if(userReply !== null) {
            // console.log(contactData)
            const obj = {
                senderid : displayData?.senderid,
                reply : userReply
            }
            const response = await axios.post(`${BASE_API_URL}/contact/reply`, obj)
            if(response.data.status === 200) {
                dynamicToast({ message: `Replied to ${displayData && displayData?.name}`, timer : 3000, icon: 'success' });
            } else {
                dynamicToast({ message: `Failed to Reply to ${displayData && displayData?.name}`, timer : 3000, icon: 'error' });
            }
        } else setErrMsg({state: true, message: 'Cannot send empty form'})
        setTimeout(()=>{
            setErrMsg({state: false, message: ''})
        }, 1500)
    }
    
  return (
    <>
        <section>
            <div className="container pb-5 pt-7" >
                <div className="row pt-7">
                    <div className="col-md-8 offset-md-2">
                        <div className="card">
                            <div className="card-header">
                                <div className="contact-show-header">
                                    <h4>Contact Information</h4>
                                    <p className="m-0">{displayData && formatDate(displayData?.time)}</p>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="contact-show-layout">
                                    <div className="contact-detail">
                                        <div className="contact-more-detail">
                                            <label>Name</label>
                                            <h5>{displayData && displayData?.name}</h5>
                                        </div>
                                        <div className="contact-more-detail">
                                            <label>Email ID</label>
                                            <h5>{displayData && displayData?.email}</h5>
                                        </div>
                                    </div>
                                    <div className="contact-more-detail">
                                        <label>Content</label>
                                        <h5>{displayData && displayData?.message}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div className="contact-show-header">
                                    <h4>Reply to {displayData && displayData?.name}</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="my-3">
                                    <div className="reply-box">
                                        <input type="text" name="reply" onChange={(event)=>setUserReply(event.target.value)}  placeholder={`Reply to ${displayData && displayData?.name}`} />
                                        <button onClick={handleSendReply} className="btn btn-primary"><i class="fa-regular fa-paper-plane-top"></i></button>
                                    </div>
                                    {
                                        errMsg?.state && (<small className="text-danger text-sm">{errMsg?.message}</small>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default DetailContact