import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] p-6">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/scp-logo.png"
          alt="SCP Foundation"
          width={48}
          height={48}
          priority
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col justify-center max-w-md">
        {/* Title Block */}
        <div className="mb-16">
          <div className="flex items-start gap-4 mb-2">
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              SECURE<br />
              CONTAIN<br />
              PROTECT
            </h1>
            {/* Red vertical bar */}
            <div
              className="w-1 h-20 mt-1"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          </div>
        </div>

        {/* Warning Block */}
        <div className="mb-12">
          <p
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            WARNING
          </p>
          <h2 className="text-2xl font-bold mb-4 leading-tight">
            THE FOUNDATION DATABASE<br />IS CLASSIFIED
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Access by unauthorized personnel is strictly prohibited.
            Perpetrators will be tracked, located, and detained
          </p>
        </div>
      </div>

      {/* Continue Button - Bottom */}
      <div className="mt-auto">
        <Link
          href="/series"
          className="block w-full py-4 text-center text-xl font-bold rounded-lg border-2 transition-colors"
          style={{
            borderColor: 'var(--color-accent)',
            color: 'var(--color-text-primary)'
          }}
        >
          Continue
        </Link>
      </div>
    </main>
  )
}
