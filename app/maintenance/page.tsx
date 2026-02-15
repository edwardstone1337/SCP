import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Foundation Archive Compromised — SCP Reader',
  description: 'SCP Reader is temporarily unavailable. Archive access will be restored shortly.',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#141414', color: '#f5f5f5', minHeight: '100vh' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Roboto Mono', 'Courier New', monospace;
            background-color: #141414;
            color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .maintenance-container {
            max-width: 640px;
            width: 100%;
            margin: 0 auto;
            padding: 48px 24px;
            text-align: center;
          }

          .breach-border {
            border: 2px solid #ef4444;
            border-radius: 4px;
            padding: 48px 32px;
            position: relative;
            animation: pulse-border 3s ease-in-out infinite;
          }

          @keyframes pulse-border {
            0%, 100% { border-color: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
            50% { border-color: #a61d24; box-shadow: 0 0 40px rgba(239, 68, 68, 0.3); }
          }

          .site-logo {
            width: 72px;
            height: 72px;
            margin: 0 auto 32px;
          }

          .heading {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ef4444;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 16px;
            line-height: 1.3;
          }

          .subheading {
            font-size: 0.8rem;
            font-weight: 700;
            color: #8c8c8c;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 1px solid #595959;
          }

          .body-text {
            font-size: 0.85rem;
            line-height: 1.8;
            color: #bfbfbf;
            margin-bottom: 16px;
          }

          .body-text:last-of-type {
            margin-bottom: 0;
          }

          .not-a-drill {
            font-size: 0.8rem;
            font-weight: 700;
            color: #ef4444;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #595959;
          }

          .footer {
            margin-top: 40px;
            font-size: 0.7rem;
            color: #595959;
            line-height: 1.6;
          }

          .footer a {
            color: #595959;
            text-decoration: underline;
            text-decoration-color: #595959;
            text-underline-offset: 2px;
          }

          .footer a:hover {
            color: #8c8c8c;
          }

          @media (max-width: 480px) {
            .breach-border { padding: 32px 20px; }
            .heading { font-size: 1.2rem; }
            .site-logo { width: 56px; height: 56px; margin-bottom: 24px; }
          }
        `}} />

        <main className="maintenance-container">
          <div className="breach-border">
            {/* SCP Foundation logo — inlined for zero external dependencies */}
            <div className="site-logo">
              <svg viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true">
                <circle cx="67.7" cy="71.5" r="33" fill="none" stroke="#f5f5f5" strokeWidth="6"/>
                <path d="m51.9 11.9h31.7l3.07 11.4.944.391c19.4 8.03 32 26.9 32 47.9 0 2.26-.149 4.53-.445 6.77l-.133 1.01 8.37 8.37-15.8 27.4-11.4-3.06-.809.623c-9.06 6.95-20.2 10.7-31.6 10.7-11.4 6e-5-22.5-3.77-31.6-10.7l-.81-.623-11.4 3.06-15.8-27.4 8.37-8.37-.133-1.01c-.296-2.25-.445-4.51-.445-6.77.000141-21 12.6-39.9 32-47.9l.944-.391z" fill="none" stroke="#f5f5f5" strokeWidth="4"/>
                <path id="b" d="m64.7 30.6v24h-5.08l8.08 14 8.08-14h-5.08l-.000265-24h-5.99" fill="#f5f5f5"/>
                <use transform="rotate(120 67.7 71.5)" xlinkHref="#b"/>
                <use transform="rotate(240 67.7 71.5)" xlinkHref="#b"/>
              </svg>
            </div>

            <h1 className="heading">Foundation Archive Compromised</h1>
            <p className="subheading">Security Level: Keter Breach Detected</p>

            <p className="body-text">
              All Foundation terminals have been temporarily locked down
              following a containment breach in the external data network.
            </p>
            <p className="body-text">
              Personnel are advised to remain calm. Archive access will be
              restored once containment protocols are re-established.
            </p>

            <p className="not-a-drill">This is not a drill.</p>
          </div>

          <p className="footer">
            SCP Reader — Monitoring situation. Check back shortly.
            <br />
            <a href="https://scp-reader.co">scp-reader.co</a>
          </p>
        </main>
      </body>
    </html>
  )
}
