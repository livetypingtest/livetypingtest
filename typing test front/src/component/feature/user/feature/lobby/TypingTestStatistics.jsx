import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../../../../shared/header/Header';
import Footer from '../../../../shared/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DynamicAlert from '../../../../shared/Toast/DynamicAlert';
import Certificate from '../../../../shared/certificate/Certificate';
import DownloadButton from '../../../../shared/certificate/DownloadCertificate';

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
    const {wpm, consistency, accuracy, correctChars, incorrectChars, timeOfCompletion, isCompleted, extraChars, time, level} = stats?.data;
    // console.log("WPM:", wpm, "Consistency:", consistency, "Accuracy:", accuracy);

    const getEvenlySpacedData = (array, numPoints) => {
        const step = Math.floor(array.length / numPoints); // Determine the spacing between points
        let result = [];
      
        // Collect evenly spaced values
        for (let i = 0; i < numPoints; i++) {
          result.push(array[i * step]);
        }
      
        return result;
      };

    const data = {
        labels: Array.from({ length: time }, (_, i) => i + 1), // X-axis label based on data length
        datasets: [
            {
                label: 'WPM',
                data: getEvenlySpacedData(wpm, time),
                borderColor: 'rgba(255, 127, 80, 1)',
                backgroundColor: 'rgba(255, 127, 80, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 127, 80, 1)',
            },
            {
                label: 'Consistency (%)',
                data: getEvenlySpacedData(consistency, time),
                borderColor: 'rgba(113, 202, 199, 1)',
                backgroundColor: 'rgba(113, 202, 199, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(113, 202, 199, 1)',
            },
            {
                label: 'Accuracy (%)',
                data: getEvenlySpacedData(accuracy, time),
                borderColor: 'rgba(255, 255, 255, 1)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            },
        ],
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
                max: 110, // Assuming percentages and WPM are capped at 100%
            },
        },
    };

    const repeatTest = () => {
        localStorage.removeItem('stats')
        navigate('/')
    }

    const handleDownload = () => {

        if(localStorage.getItem('userToken')) {
            const input = certificateRef.current;
    
        // Use html2canvas to capture the certificate as an image
        html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            
            // Set the PDF size based on the canvas
            const imgWidth = 210; // Width in mm (A4 size)
            const pageHeight = 295; // Height in mm (A4 size)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
    
            let position = 0;
    
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save('certificate.pdf'); // Save the PDF
        })
        .catch((error) => {
            console.error('Error generating PDF:', error);
        });
        } else {
            setShowAlert(true)
            setAlertDetail({
                title : 'Access Denied!',
                type : 'error',
                message : 'To Download Certificate Please Signup/Signin',
                navigateTo : '/signup',
                confirmBtn : false
            })
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

    // useEffect(()=>{
    //     if(isCompleted){
    //         setShowAlert(true)
    //         setAlertDetail({
    //             title : 'Congratulations!',
    //             type : 'Success',
    //             message : `Hurrey! You have comleted the test before the time`,
    //             navigateTo : '',
    //             confirmBtn : true
    //         })
    //     }
    // }, [])

    const calculateAverage = (numbers) => {
        if (numbers.length === 0) return 0; // Avoid division by zero
        const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
        return sum / numbers.length; // Return the average
    };


    return(
        <>
            <Header />
            <section>
                <div className="container p-custom">
                    <div className="row align-items-center py-4">
                        <div className="col-md-2">
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
                        </div>
                        <div className="col-md-10 ">
                        <Line data={data} options={options}  height={window.innerWidth <= 767 ? 100 : 30} width={"100%"}  />
                        </div>
                        <div className="col-md-12 p-custom">
                            <div className="below-graph">
                                <div>
                                    <h4>Test Type</h4>
                                    <h1>time {time}</h1>
                                </div>
                                <div>
                                    <h4>Characters</h4>
                                    <div className='item'><span>Correct/Incorrect/Extra</span><h1>{`${correctChars}/${incorrectChars}/${extraChars}`}</h1></div>
                                </div>
                                <div>
                                    <h4>Consistency</h4>
                                    <h1>{Math.round(calculateAverage(consistency))}%</h1>
                                </div>
                                <div>
                                    <h4>Time Taken</h4>
                                    <h1>{timeOfCompletion}s</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 p-custom">
                            <div className="below-graph-btn">
                                <div className='item'><span>Download Certificate</span><DownloadButton onDownload={handleDownload} /></div>
                                <div className='item'><span>Repeat Test</span><button onClick={repeatTest}><i className="fa-solid fa-repeat fa-xl" style={{ color: "#8c8c8c" }} /></button></div>
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
