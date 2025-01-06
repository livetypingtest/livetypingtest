import { Helmet } from "react-helmet"

const DynamicTitle = ({ title, description, icon }) => {
  return (
        <Helmet>
            {/* Set the page title */}
            <title>{title || 'Live Typing Test'}</title>
            {/* Meta description for SEO */}
            <meta name="description" content={description || 'Live Typing Test'} />
            {/* Open Graph tags for social media */}
            <meta property="og:title" content={title || 'Live Typing Test'} />
            <meta property="og:description" content={description || 'Live Typing Test'} />
            <meta property="og:image" content={icon || '/assets/images/logo.svg'} />
            <link rel="icon" href={icon || '/assets/images/logo.svg'} />
        </Helmet>
  )
}

export default DynamicTitle