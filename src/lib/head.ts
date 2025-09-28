import { site } from "@/config/site";

export const setPageTitle = (pageTitle?: string) => {
  const title = pageTitle 
    ? `${pageTitle} • ${site.name}` 
    : site.tagline 
      ? `${site.name} — ${site.tagline}`
      : site.name;
  document.title = title;
  
  // Update Open Graph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }
  
  // Update Twitter title
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title);
  }
};

export const updateMetaTags = () => {
  // Update description
  const description = document.querySelector('meta[name="description"]');
  if (description && site.tagline) {
    description.setAttribute('content', site.tagline);
  }
  
  // Update author
  const author = document.querySelector('meta[name="author"]');
  if (author) {
    author.setAttribute('content', site.name);
  }
  
  // Update Open Graph tags
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && site.tagline) {
    ogDescription.setAttribute('content', site.tagline);
  }
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', site.domain);
  }
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute('content', `${site.domain}/og-image.png`);
  }
  
  // Update Twitter tags
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription && site.tagline) {
    twitterDescription.setAttribute('content', site.tagline);
  }
  
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute('content', `${site.domain}/og-image.png`);
  }
};