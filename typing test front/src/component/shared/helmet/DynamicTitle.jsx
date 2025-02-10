import { Helmet } from "react-helmet"

const DynamicTitle = ({ title, description, icon }) => {
  return (
        <Helmet>
            {/* Set the page title */}
            <title>{title || 'Live Typing Test - Free Online Typing Speed Practice in 60 seconds'}</title>
            {/* Meta description for SEO */}
            <meta name="description" content={description || 'Free Online Minimalistic Typing Speed Test with a certificate to check words per minute (WPM) in different times & modes.'} />
            {/* Open Graph tags for social media */}
            <meta property="og:title" content={title || 'Live Typing Test - Free Online Typing Speed Practice in 60 seconds'} />
            <meta property="og:description" content={description || 'Free Online Minimalistic Typing Speed Test with a certificate to check words per minute (WPM) in different times & modes.'} />
            <meta property="og:image" content={icon || '/assets/images/favicon.png'} />
            <link rel="icon" href={icon || '/assets/images/favicon.png'} />
        </Helmet>
  )
}

export default DynamicTitle