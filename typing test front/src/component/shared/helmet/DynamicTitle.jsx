import { Helmet } from "react-helmet"

const DynamicTitle = ({ title, description, icon }) => {
  return (
        <Helmet>
            {/* Set the page title */}
            <title>{title}</title>
            {/* Meta description for SEO */}
            <meta name="description" content={description || 'Live Typing Test'} />
            {/* Open Graph tags for social media */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description || 'Live Typing Test'} />
            <meta property="og:image" content={icon || '/assets/images/favicon.png'} />
            <link rel="icon" href={icon || '/assets/images/favicon.png'} />
        </Helmet>
  )
}

export default DynamicTitle