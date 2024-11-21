import { useState } from "react";
import { dynamicToast } from '../../shared/Toast/DynamicToast'
import axios from "axios";
import { ADMIN_API_URL } from "../../../util/API_URL";

const AdminAnalyticsConfig = () => {
  const [trackingId, setTrackingId] = useState("");
  const [codeEditor, setCodeEditor] = useState("");
  const [errMsg, setErrMsg] = useState({state: false, message: ''})

  const handleSave = async() => {
    if (trackingId.trim() === "") {
      setErrMsg({state: true, message: 'Tracking ID is required!'})
      setTimeout(()=>{setErrMsg({state: false, message: ''})}, 1500)
      return;
    }
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/google-analytics`, {trackingId: trackingId}, { headers : { Authorization : ID } } )
    if(response.data.status === 200) {
      setCodeEditor('')
      setTrackingId('')
      dynamicToast({ message: `Tracking ID saved: ${trackingId}`, timer : 3000, icon: 'success' });
    }
    
  };

  // Example Google Analytics Script Snippet
  const exampleSnippet = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=TRACKING_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'TRACKING_ID');
    </script>`
  .replace(/TRACKING_ID/g, trackingId || "YOUR_TRACKING_ID");

  return (
    <section>
      <div className="container pb-5">
        <div className="row">
          <div className="col-md-12">
            <div className="analytics-config-container">
              <h2 className="title-cs">Google Analytics Configuration</h2>

              {/* Code Editor Area */}
              <div className="code-editor-container">
                <label htmlFor="codeEditor" className="label-cs">
                  Example Script Snippet:
                </label>
                <textarea
                  id="codeEditor"
                  // disabled
                  style={{cursor: 'move'}}
                  className="code-editor-cs"
                  readOnly
                  value={exampleSnippet}
                />
              </div> 

              {/* Non-controlled Code Editor */}
              <div className="code-editor-container">
                <label htmlFor="adminCodeEditor" className="label-cs">
                  Code Editor:
                </label>
                <textarea
                  id="adminCodeEditor"
                  className="code-editor-cs"
                  value={codeEditor}
                  onChange={(e)=>setCodeEditor(e.target.value)}
                  placeholder="Type your custom script here..."
                />
              </div>

              {/* Tracking ID Input */}
              <div className="input-container">
                <label htmlFor="trackingId" className="label-cs">
                  Tracking ID:
                </label>
                <input
                  type="text"
                  id="trackingId"
                  placeholder="Enter Tracking ID"
                  className="input-field-cs"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                {errMsg?.state && (<small className="text-danger text-sm">{errMsg?.message}</small>)}
              </div>

              {/* Save Button */}
              <button className="btn btn-primary mt-3" onClick={handleSave}>
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalyticsConfig;
