import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import './BrandedPageLoader.css';

/**
 * Suspense fallback that stays invisible for fast chunk loads and only
 * displays the Sophis Central brand treatment when a page chunk is slow.
 */
export function BrandedPageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 450);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="sc-branded-page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div className="sc-branded-page-loader__content">
        <BrandLogo
          variant="full"
          linked={false}
          tone="dark"
          className="sc-branded-page-loader__logo"
        />
        <div className="sc-branded-page-loader__progress" aria-hidden="true">
          <span />
        </div>
        <span className="sr-only">Loading page…</span>
      </div>
    </div>
  );
}
