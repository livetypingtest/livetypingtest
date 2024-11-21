import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../../util/API_URL';
import GoogleAnalytics from '../googleAnalytics/GoogleAnalytics'



const ManageAds = () => {

    const [adsScriptSnippet, setAdsScriptSnippet] = useState('');
    const [adsClientID, setAdsClientID] = useState('');

    // Fetch existing ad settings on component mount
    useEffect(() => {
        axios.get(`${ADMIN_API_URL}/ads`)
            .then(response => {
                if (response.data) {
                    setAdsScriptSnippet(response.data.adsScriptSnippet || '');
                    setAdsClientID(response.data.adsClientID || '');
                }
            })
            .catch(error => console.error('Error fetching ad settings:', error));
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // await axios.post(`${ADMIN_API_URL}/ads`, {
            //     adsScriptSnippet,
            //     adsClientID,
            // });
            dynamicToast({ message: 'Ad settings saved successfully', timer : 3000, icon: 'success' });
        } catch (error) {
            console.error('Error saving ad settings:', error);
        }
    };


  return (
    <>
        <section>
            <div className="container pt-7 pb-5">
                <div className="row">
                    <div className="col-md-12">
                        <h2>Ads Settings</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="card bg-theme">
                                <div className="card-body">
                                    <div className="custom-ads-layout">
                                        <div className="my-3 w-45">
                                            <p>Google AdSense Unit Ads Client ID</p>
                                            <input type="text" name="" placeholder='ca-pub-123456789' className='form-control' id="" />
                                        </div>
                                        <div className="my-3 w-45">
                                            <p >Google AdSense Slot ID</p>
                                            <input type="text" name="" placeholder='123456789' className='form-control' id="" />
                                        </div>
                                    </div>
                                    <div className="card-cs">
                                        <h2>Where to get Google AdSense Client ID?</h2>
                                        <p>
                                            When you get the snippet code of unit ads, you can see this attribute{" "}
                                            <code>data-ad-client="ca-pub-123456789"</code>, the{" "}
                                            <code>ca-pub-123456789</code> is the unit ads client id.
                                        </p>
                                        <h3 className='mb-3'>Google AdSense Unit Ads Snippet Example:</h3>
                                        <div className="code-block">
                                            <code>
                                            &lt;script async
                                            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123456789"
                                            crossorigin="anonymous"&gt;&lt;/script&gt; &lt;ins class="adsbygoogle"
                                            style="display:block" data-ad-client="ca-pub-123456789"
                                            data-ad-slot="123456789" data-ad-format="auto"&gt;&lt;/ins&gt;
                                            &lt;script&gt; (adsbygoogle = window.adsbygoogle || []).push({"{"}
                                            {"}"}); &lt;/script&gt;
                                            </code>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer ">
                                    <button type='submit' className="btn btn-primary btn-lg">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <GoogleAnalytics />
    </>
  )
}

export default ManageAds