import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas';
import Certificate from "../certificate/Certificate";
import DynamicTitle from "../helmet/DynamicTitle";
import { calculateAverage } from "../../../util/calculate";

const UserMatches = () => {
    const param = useParams();
    const { level } = param;
    
    const rawUserData = useSelector(state => state.AdminDataSlice.userData);

    const [matchData, setMatchData] = useState({ match1: [], match3: [], match5: [] });
    const [displayData, setDisplayData] = useState([]);
    const [timeFilter, setTimeFilter] = useState('1');
    const certificateRef = useRef();
    const [stats, setStats] = useState({ data: '', date: '' });

    useEffect(() => {
        const match1 = rawUserData?.match_1?.filter(value => value.level === level) || [];
        const match3 = rawUserData?.match_3?.filter(value => value.level === level) || [];
        const match5 = rawUserData?.match_5?.filter(value => value.level === level) || [];
        console.log(rawUserData)
        setMatchData({ match1, match3, match5 });
        setDisplayData(match1);
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
    <DynamicTitle title={"Live Typing Test | Matches"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Matches"}  />

            <section>
                <div className="container pt-7">
                    <div className="row">
                        <div className="col-md-12 py-4">
                            <div className="stac-head">
                                <h3>Match Mode {param.level} for {timeFilter} Min</h3>
                                <div className="filter">
                                    <div className="filter-btn">
                                        <button onClick={() => handleFilterTime('1')} className={'btn btn-outline-primary '+(timeFilter === '1' ? 'active' : '')}>01 Min</button>
                                        <button onClick={() => handleFilterTime('3')} className={'btn btn-outline-primary '+(timeFilter === '3' ? 'active' : '')}>03 Min</button>
                                        <button onClick={() => handleFilterTime('5')} className={'btn btn-outline-primary '+(timeFilter === '5' ? 'active' : '')}>05 Min</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="alluser-table my-5">
                                <table className="table table-dark m-0 table-equal table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Played On</th>
                                            <th>Download Certificate</th>
                                            <th>WPM</th>
                                            <th>Accuracy</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                            {displayData.map((value, index) => {
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
                                                            <button className="btn" onClick={() => handleUpdateData(value)}>
                                                                <i className="fa-solid fa-download fa-lg" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <div style={{ position: 'absolute', left: '-300%', top: '28%' }}>
                <Certificate ref={certificateRef} props={stats} />
            </div>
        </>
    );
};

export default UserMatches;
