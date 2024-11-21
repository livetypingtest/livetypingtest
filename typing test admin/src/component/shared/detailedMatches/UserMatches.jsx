import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Certificate from "../certificate/Certificate";

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
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210; // A4 size width
            const pageHeight = 295; // A4 size height
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

            pdf.save('certificate.pdf');
        }).catch((error) => {
            console.error('Error generating PDF:', error);
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
