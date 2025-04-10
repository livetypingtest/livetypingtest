import './CertificateStyle.css'
import  { useEffect, useState, forwardRef } from 'react';

import { useSelector } from 'react-redux';
import Signature from '../svg/Signature';
import LogoSvg from '../svg/LogoSvg';
import Line from '../svg/Line';

const Certificate = forwardRef((props, ref) => {

    const [data, setData] = useState({
        wpm : '',
        username : '',
        consistency : '',
        accuracy : '',
        date : '',
        level : ''
    })

    const userData = useSelector(state => state.AdminDataSlice.userData)
    
    const calculateAverage = (numbers) => {
        if (numbers.length === 0) return 0; // Avoid division by zero
        const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
        return sum / numbers.length; // Return the average
    };

    const formatDate = (date) => {
        // Check if the date is valid before formatting
        const validDate = new Date(date); // Ensure it's a Date object
    
        if (isNaN(validDate)) {
            // Handle invalid date case
            console.error('Invalid date:', date);
            return 'Invalid Date';
        }
    
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(validDate);
    };
    
    useEffect(() => {
        if (props) {
            const { data, date } = props?.props || {}; // Safely destructure props
            if (data && date) {
                const { wpm, consistency, accuracy, level } = data;
    
                setData({
                    wpm: Math.round(calculateAverage(wpm)),
                    username: userData?.username,
                    level: level,
                    consistency: Math.round(calculateAverage(consistency)),
                    accuracy: Math.round(calculateAverage(accuracy)),
                    date: formatDate(date), // Ensure the date is valid before formatting
                });
            }
        }
    }, [props]);
    

  return (
    <>
        <div ref={ref} className="container pm-certificate-container">
            <div className="outer-border" />
                <div className="inner-border" />
                <div className="pm-certificate-border col-md-12 col-xs-12">
                    <div className="row pm-certificate-header">
                    <div className="pm-certificate-title grouped-logo cursive col-md-12 col-xs-12 text-center">
                        <LogoSvg />
                        <h2 className='text-dark'> Certificate of Completion</h2>
                    </div>
                    </div>
                    {/* <div className="row pm-certificate-body"> */}
                    <div className="pm-certificate-block">
                        <div className="col-xs-12 col-md-12">
                        <div className="row">
                            <div className="pb-4  d-flex justify-content-center">
                            <Line />
                            </div>
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                            <div className="pm-certificate-name underline-cer margin-0 col-xs-8 text-center">
                                <span className="pm-credits-text font-18 text-dark  sans">
                                    This Certification is hereby Awarded to:
                                </span> <br />
                            <span className="pm-name-text text-dark font-30 sans bold">{userData ? userData?.username : ''}</span>
                            </div>
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                        </div>
                        </div>
                        <div className="col-xs-12 col-md-12">
                        <div className="row">
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                            <div className="pm-earned col-xs-8 text-center">
                            <span className="pm-earned-text text-dark padding-0 block cursive">
                                Has Scored
                            </span>
                            <div className="show-score">
                                <span className="pm-credits-text text-dark font-18  bold sans">
                                    WPM : {data ? data.wpm : ''}
                                </span>
                                <span className="pm-credits-text text-dark font-18 bold sans">
                                    Consistency : {data ? data.consistency : ''}
                                </span>
                                <span className="pm-credits-text text-dark font-18 bold sans">
                                    Accuracy : {data ? data.accuracy : ''}
                                </span>
                                <span className="pm-credits-text text-dark font-18 bold sans">
                                    Level : {data ? data.level?.toLocaleUpperCase() : ''}
                                </span>
                            </div>
                            </div>
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                            <div className="col-xs-12 col-md-12" />
                        </div>
                        </div>
                       
                        <div className="col-xs-12 col-md-12">
                        <div className="row">
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                            <div className="pm-course-title underline-cer col-xs-8 text-center">
                            <span className="pm-credits-text block bold sans">
                            </span>
                            </div>
                            <div className="col-xs-2 col-md-2">{/* LEAVE EMPTY */}</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-12">
                        <div className="row">
                            <div className="pm-certificate-footer mt-16">
                                <div className="col-xs-4 pm-certified col-md-5 text-center">
                                    <span className="pm-credits-text block text-dark sans">
                                        Signature of Director
                                    </span>
                                    <div className='text-dark underline-cer signature'><Signature /></div>
                                    {/* <span className="pm-empty-space block underline-cer" />  */}
                                    {/* <span className="bold block">
                                        Live Typing Test
                                    </span> */}
                                </div>
                                <div className="col-xs-1 col-md-2"></div>
                                <div className="col-xs-4 col-md-5 pm-certified col-xs-4 text-center">
                                    <span className="pm-credits-text text-dark block sans">Date Completed</span>
                                        
                                    <span className="pm-empty-space block bold font-18 underline-cer">
                                    <h6 className='bold text-dark font-18 sans' style={{margin : 0}}>{data ? data.date : ''}</h6>
                                    </span>
                                    {/* <span className="bold block">DOB: </span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    </>
  )
})

export default Certificate