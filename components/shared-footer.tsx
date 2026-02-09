'use client';

import Script from 'next/script';

export function SharedFooter() {
  return (
    <>
      <div id="es-footer" data-project="scp" />
      <Script
        src="https://footer.edwardstone.design/src/footer.js"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}
