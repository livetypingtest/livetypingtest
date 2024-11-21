// DownloadButton.js

const DownloadButton = ({ onDownload }) => {

    return (
        // <button onClick={onDownload}>Download Certificate</button>
        <button onClick={onDownload}><i className="fa-solid fa-download fa-xl" style={{ color: "#8c8c8c" }} /></button>
    );
};

export default DownloadButton;