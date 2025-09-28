import { useEffect } from 'react';

const AdminMeta = () => {
  useEffect(() => {
    // Add meta robots noindex tag
    const existingMeta = document.querySelector('meta[name="robots"]');
    if (existingMeta) {
      existingMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      const metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      metaTag.content = 'noindex, nofollow';
      document.head.appendChild(metaTag);
    }

    // Cleanup function to restore original robots meta tag
    return () => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    };
  }, []);

  return null;
};

export default AdminMeta;