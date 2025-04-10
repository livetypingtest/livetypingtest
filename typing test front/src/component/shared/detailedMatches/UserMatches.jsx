import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Certificate from "../certificate/Certificate";
import MetaUpdater from "../../../util/MetaUpdater";
import DynamicTitle from "../helmet/DynamicTitle";
import { calculateAverage } from "../../../util/calculate";

const UserMatches = () => {
    const param = useParams();
    const { level } = param;
    
    const rawUserData = useSelector(state => {
        if(localStorage.getItem('userToken')) {
            return state.UserDataSlice.userData;
        } else {
            return state.AdminDataSlice.userData;
        }
    });

    const [matchData, setMatchData] = useState({ match1: [], match3: [], match5: [] });
    const [displayData, setDisplayData] = useState([]);
    const [timeFilter, setTimeFilter] = useState('1');
    const certificateRef = useRef();
    const [stats, setStats] = useState({ data: '', date: '' });

    useEffect(() => {
        const match1 = rawUserData?.match_1?.filter(value => value.level === level) || [];
        const match3 = rawUserData?.match_3?.filter(value => value.level === level) || [];
        const match5 = rawUserData?.match_5?.filter(value => value.level === level) || [];

        // Get the current date and the date for 7 days ago
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));

        // Filter the matches by date within the last 7 days
        const filterByDate = (matches) => {
            return matches.filter((match) => {
                const matchDate = new Date(match.matchdate);
                return matchDate >= sevenDaysAgo;
            });
        };

        setMatchData({
            match1: filterByDate(match1),
            match3: filterByDate(match3),
            match5: filterByDate(match5)
        });
        setDisplayData(filterByDate(match1)); // Set initial display data to match1
    }, [rawUserData, level]);

    useEffect(() => {
        const findProp = {
            '1': 'match1',
            '3': 'match3',
            '5': 'match5',
        };
        const getProp = findProp[timeFilter];
        setDisplayData(matchData[getProp]);
    }, [timeFilter, matchData]);

    const handleFilterTime = (time) => {
        setTimeFilter(time);
    };

    const handleDownload = () => {
        const input = certificateRef.current;
    
        // Use html2canvas to capture the certificate as an image
        html2canvas(input, {
            scale: 2, // Increase rendering scale for better quality
            useCORS: true, // Ensure cross-origin images are loaded correctly
            logging: false, // Disable console logs from html2canvas
        }).then((canvas) => {
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
    };
    
    const handleUpdateData = (data) => {
        const matchData = {
            wpm: data?.wpm,
            accuracy: data?.accuracy,
            consistency: data?.consistency,
            level: data?.level
        };
        setStats({ data: matchData, date: data?.matchdate });

        // Use setTimeout to delay the download until the state has been updated
        setTimeout(() => {
            handleDownload(); // Ensure download occurs after state is set
        }, 100); // Adjust the timeout duration as needed
    };


    return (
        <>
            <DynamicTitle title={"Live Typing Test | Matches"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Terms & Condition"}  />

            <Header />
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="font-active text-left mb-2">{level} Mode</h4>
                            <p className="alert custom-alert mb-3"><i class="fa-regular fa-circle-exclamation" style={{color: '#FFD43B'}}></i> &nbsp; Please be advised that certificates will be deleted after 7 days. We encourage you to download your certificate before the expiration date.</p>
                            <div className="leaderboard-head">
                                <div className="filter">
                                    <div className="filter-btn">
                                        <button onClick={() => handleFilterTime('1')} className={timeFilter === '1' ? 'active' : ''}>01 Min</button>
                                        <button onClick={() => handleFilterTime('3')} className={timeFilter === '3' ? 'active' : ''}>03 Min</button>
                                        <button onClick={() => handleFilterTime('5')} className={timeFilter === '5' ? 'active' : ''}>05 Min</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="leaderboard-table my-3">
                                    <table className="table-equal">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Played On</th>
                                                <th>WPM</th>
                                                <th>Accuracy</th>
                                                <th>Download Certificate</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                displayData?.length !== 0 ? displayData.map((value, index) => {
                                                    const rawDate = value.matchdate;
                                                    const parsedDate = new Date(rawDate);
                                                    let formatDate;
                                                    if (!isNaN(parsedDate)) {
                                                        formatDate = new Intl.DateTimeFormat('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }).format(parsedDate);
                                                    } else {
                                                        console.error('Invalid date format:', rawDate);
                                                    }
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{formatDate}</td>
                                                            <td>{parseInt(calculateAverage(value?.wpm)?.toFixed(2))}</td>
                                                            <td>{calculateAverage(value?.accuracy)?.toFixed(2)}%</td>
                                                            <td>
                                                                <button onClick={() => handleUpdateData(value)}>
                                                                    <i className="fa-solid fa-download fa-xl" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }) : (
                                                    <tr>
                                                        <td>No Match Played</td>
                                                        <td>No Match Played</td>
                                                        <td>No Match Played</td>
                                                        <td>No Match Played</td>
                                                        <td>No Match Played</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <div style={{ position: 'absolute', left: '-300%', top: '28%' }}>
                <Certificate ref={certificateRef} props={stats} />
            </div>
        </>
    );
};

export default UserMatches;
