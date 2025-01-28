import { Helmet } from "react-helmet"

const DynamicTitle = ({ title, description, icon }) => {
  return (
        <Helmet>
            {/* Set the page title */}
            <title>{title || 'Live Typing Test - English Typing Speed Test & Practice in 60 sec'}</title>
            {/* Meta description for SEO */}
            <meta name="description" content={description || 'Free Online English Typing Speed Test & Practice to increase average words per minute (WPM) in 1 minute, 3 minutes and 5 minutes with Certificate.'} />
            {/* Open Graph tags for social media */}
            <meta property="og:title" content={title || 'Live Typing Test - English Typing Speed Test & Practice in 60 sec'} />
            <meta property="og:description" content={description || 'Free Online English Typing Speed Test & Practice to increase average words per minute (WPM) in 1 minute, 3 minutes and 5 minutes with Certificate.'} />
            <meta property="og:image" content={icon || '/assets/images/favicon.png'} />
            <link rel="icon" href={icon || '/assets/images/favicon.png'} />
        </Helmet>
  )
}

export default DynamicTitle