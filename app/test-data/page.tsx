import { createClient } from '@/lib/supabase/server'

export default async function TestDataPage() {
  const supabase = await createClient()

  // Get total count
  const { count: totalCount } = await supabase
    .from('scps')
    .select('*', { count: 'exact', head: true })

  // Get counts by series
  const { data: seriesData } = await supabase
    .from('scps')
    .select('series')
    .order('series')

  const seriesCounts = seriesData?.reduce((acc, { series }) => {
    acc[series] = (acc[series] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get sample SCPs (first 10 from Series 1)
  const { data: sampleScps } = await supabase
    .from('scps')
    .select('scp_id, scp_number, title, series, rating')
    .eq('series', 'series-1')
    .order('scp_number')
    .limit(10)

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Phase 2: Database Test ✅</h1>

        {/* Total Count */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Database Summary</h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalCount?.toLocaleString()}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total SCPs Loaded
          </p>
        </div>

        {/* Series Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">SCPs by Series</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(seriesCounts || {}).map(([series, count]) => (
              <div
                key={series}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className="font-mono text-sm">{series}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Data */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Sample SCPs (Series 1)</h2>
          <div className="space-y-3">
            {sampleScps?.map((scp) => (
              <div
                key={scp.scp_id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <span className="font-mono font-semibold text-sm mr-3">
                    {scp.scp_id}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {scp.title}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ⭐ {scp.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-semibold">
            ✅ Phase 2 Complete: Database ready with{' '}
            {totalCount?.toLocaleString()} SCPs
          </p>
          <p className="text-green-700 dark:text-green-300 text-sm mt-2">
            Next: Phase 3 - Authentication & User Progress Tracking
          </p>
        </div>
      </div>
    </main>
  )
}
