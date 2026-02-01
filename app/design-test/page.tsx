export default function DesignTest() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="w-16 h-16"
              style={{ backgroundColor: `var(--color-red-${i})` }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="w-16 h-16"
              style={{ backgroundColor: `var(--color-grey-${i})` }}
            />
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <p className="text-xs">12px - Extra Small</p>
        <p className="text-sm">14px - Small</p>
        <p className="text-base">16px - Base</p>
        <p className="text-lg">20px - Large</p>
        <p className="text-xl">24px - XL</p>
        <p className="text-2xl">30px - 2XL</p>
        <p className="text-3xl">38px - 3XL</p>
        <p className="text-4xl">46px - 4XL</p>
        <p className="text-5xl">56px - 5XL</p>
        <p className="font-mono text-base mt-4">Roboto Mono</p>
      </section>
    </div>
  );
}
