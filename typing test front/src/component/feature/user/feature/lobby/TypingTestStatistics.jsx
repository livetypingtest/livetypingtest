import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DynamicAlert from '../../../../shared/Toast/DynamicAlert';
import Certificate from '../../../../shared/certificate/Certificate';
import DownloadButton from '../../../../shared/certificate/DownloadCertificate';
import MetaUpdater from '../../../../../util/MetaUpdater'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TypingTestStats = () => {

    const certificateRef = useRef();
    const [alertDetail, setAlertDetail] = useState({
        title : '',
        message : '',
        type : '',
        navigateTo : '',
        confirmBtn : false
    })
    const [showAlert, setShowAlert] = useState(false)
    let stats = localStorage.getItem('stats')
    stats = JSON.parse(stats)
    const navigate = useNavigate();
    const {wpm, consistency, accuracy, correctChars, incorrectChars, extraChars, time, level} = stats?.data;
    // console.log("WPM:", wpm, "Consistency:", consistency, "Accuracy:", accuracy);

    const getEvenlySpacedData = (array, numPoints, step) => {
        let result = [];
      
        // Collect evenly spaced values based on the step interval
        for (let i = 0; i < numPoints; i++) {
            result.push(array[i * step]); // Skip points based on the step
        }
      
        return result;
    };
    
    const calculateTicks = (totalTime) => {
        // Dynamically calculate tick intervals based on total time
        if (totalTime <= 60) return Array.from({ length: Math.floor(totalTime / 2) + 1 }, (_, i) => i * 2); // 2-second gap
        if (totalTime <= 180) return Array.from({ length: Math.floor(totalTime / 6) + 1 }, (_, i) => i * 4); // 4-second gap
        if (totalTime <= 300) return Array.from({ length: Math.floor(totalTime / 10) + 1 }, (_, i) => i * 5); // 5-second gap
        return [];
    };
    
    const generateData = (time, wpm, accuracy, consistency) => {
        const tickInterval = time <= 60 ? 2 : (time <= 180 ? 6 : 10); // Determine the appropriate tick interval
        const numPoints = Math.floor(time / tickInterval);
    
        return {
            labels: calculateTicks(time), // X-axis label based on the calculated ticks
            datasets: [
                {
                    label: 'WPM',
                    data: getEvenlySpacedData(wpm, numPoints, tickInterval),
                    borderColor: 'rgba(255, 127, 80, 1)',
                    backgroundColor: 'rgba(255, 127, 80, 0.2)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 127, 80, 1)',
                },
                // {
                //     label: 'Consistency (%)',
                //     data: getEvenlySpacedData(consistency, numPoints, tickInterval),
                //     borderColor: 'rgba(113, 202, 199, 1)',
                //     backgroundColor: 'rgba(113, 202, 199, 0.2)',
                //     fill: false,
                //     tension: 0.4,
                //     pointBackgroundColor: 'rgba(113, 202, 199, 1)',
                // },
                {
                    label: 'Accuracy (%)',
                    data: getEvenlySpacedData(accuracy, numPoints, tickInterval),
                    borderColor: 'rgba(255, 255, 255, 1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                },
            ],
        };
    };
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Typing Test Statistics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 150, // Assuming percentages and WPM are capped at 100%
            },
        },
    };

    const data = generateData(time, wpm, accuracy, consistency);

    const repeatTest = () => {
        localStorage.removeItem('stats')
        navigate('/')
    }

    const handleDownload = () => {
        if(localStorage.getItem('userToken')) {
            const input = certificateRef.current;
    
            // Use html2canvas to capture the certificate as an image
            html2canvas(input).then((canvas) => {
                // Create an image file from the canvas
                const imgData = canvas.toDataURL('image/png'); // 'image/png' for PNG format
    
                // Create a link element to trigger the download
                const link = document.createElement('a');
                link.href = imgData; // Set the image data as the href
                link.download = 'certificate.png'; // Set the filename for the downloaded image
    
                // Trigger the download
                link.click();
            }).catch((error) => {
                console.error('Error generating image:', error);
            });
        } else {
            setShowAlert(true);
            setAlertDetail({
                title: 'Access Denied!',
                type: 'error',
                message: 'To Download Certificate Please Signup/Signin',
                navigateTo: '/signup',
                confirmBtn: false
            });
        }
    };
    
    

    useEffect(()=>{
        if(localStorage.getItem('newRecord')) {
            setShowAlert(true)
            setAlertDetail({
                title : 'Congratulations!',
                type : 'Success',
                message : `You have broken your previous highest record in the ${time/60}-minute ${level} mode!`,
                navigateTo : '',
                confirmBtn : true
            })
        }
    }, [])

    const handleAlertClose = () => {
        localStorage.removeItem('newRecord'); // Clear local storage
        setShowAlert(false); // Set showAlert to false
    };


    const calculateAverage = (numbers) => {
        if (numbers.length === 0) return 0; // Avoid division by zero
        const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
        return sum / numbers.length; // Return the average
    };

    //convert the timeer in proper format---------------------------------------------------------------
  const convertSecondsToFormattedTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60); // Get the number of minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds

    // Format the seconds to always be two digits
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
  };
  //convert the timeer in proper format---------------------------------------------------------------

  useEffect(() => {
    MetaUpdater.updateMeta("Live Typing Test | Statistics", "/assets/images/favicon.png");
}, []);

    return(
        <>
            <Header />
            <section>
                <div className="container p-custom">
                    <div className="row align-items-center py-4">
                        {/* <div className="col-md-2">
                            <div className="statistics-layout">
                                <div>
                                    <h4>WPM</h4>
                                    <h1>{Math.round(calculateAverage(wpm))}</h1>
                                </div>
                                <div>
                                    <h4>Accuracy</h4>
                                    <h1>{Math.round(calculateAverage(accuracy))}<span>%</span></h1>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-md-12 ">
                        <Line data={data} options={options}  height={window.innerWidth <= 767 ? 100 : 30} width={"100%"}  />
                        </div>
                        <div className="col-md-12 p-custom">
                            <div className="below-graph">
                                <div>
                                    <h4>Test Type</h4>
                                    <h1>{level} {convertSecondsToFormattedTime(time)}</h1>
                                </div>
                                <div>
                                    <h4>Characters</h4>
                                    <div className='item'><span>Correct/Incorrect/Extra</span><h1>{`${correctChars}/${incorrectChars}/${extraChars}`}</h1></div>
                                </div>
                                <div>
                                    <h4>WPM</h4>
                                    <h1>{Math.round(calculateAverage(wpm))}</h1>
                                </div>
                                <div>
                                    <h4>Accuracy</h4>
                                    <h1>{Math.round(calculateAverage(accuracy))}<span>%</span></h1>
                                </div>
                                <div>
                                    <h4>Consistency</h4>
                                    <h1>{Math.round(calculateAverage(consistency))}</h1>
                                </div>
                                <div>
                                    <h4>Time Taken</h4>
                                    <h1>{time}s</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 p-custom">
                            <div className="below-graph-btn">
                                <div className='item'><span>Download Certificate</span><DownloadButton onDownload={handleDownload} /></div>
                                <div className='item'><span>Repeat Test</span><button onClick={repeatTest}><i className="fa-solid fa-repeat fa-xl" style={{ color: "#8c8c8c" }} /><p className='mt-2 font-idle'>Repeat</p></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

            <div style={{position : 'absolute', left : '-260%', top : '28%' }} >
                <Certificate ref={certificateRef} props={stats} />
            </div>

            <DynamicAlert
            type={alertDetail.type}
            title={alertDetail.title}
            message={alertDetail.message}
            trigger={showAlert} // This will trigger the alert
            navigateTo={alertDetail.navigateTo}
            confirmBtn={alertDetail.confirmBtn}
            onClose={handleAlertClose} // Pass the onClose handler
            />

            
        </>
    );
};

export default TypingTestStats;
