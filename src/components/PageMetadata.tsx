interface PageMetadataProps {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export function PageMetadata({ title, description, imageUrl }: PageMetadataProps) {
  return (
    <>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}
      
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}
      
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:card" content="summary_large_image" />}
    </>
  );
}
