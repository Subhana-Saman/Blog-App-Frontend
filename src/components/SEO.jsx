import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url, type = "website" }) {
  const siteTitle = "DevVerse";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} — Modern AI Blog Platform`;
  const desc = description?.slice(0, 160) || "Discover and share developer-focused blogs powered by AI.";
  const ogImage = image || "/og-default.png";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}