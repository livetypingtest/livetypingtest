// DownloadButton.js

const DownloadButton = ({ onDownload }) => {

    return (
        // <button onClick={onDownload}>Download Certificate</button>
        <button onClick={onDownload}><i className="fa-solid fa-download fa-xl" style={{ color: "#8c8c8c" }} /><br /><p className="font-idle mt-2">Download</p></button>
    );
};

export default DownloadButton;