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
            <meta property="og:image" content={icon || '/default-image.jpg'} />
            <link rel="icon" href={icon || '/default-favicon.ico'} />
        </Helmet>
  )
}

export default DynamicTitle