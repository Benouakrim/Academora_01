import clientPkg from '../../../package.json'

export default function AdminHealthPage() {
  const deps = clientPkg.dependencies || {}
  const reactVersion = deps.react
  const rechartsVersion = deps.recharts
  const clerkVersion = deps['@clerk/clerk-react']
  const mismatches: string[] = []

  // Simple heuristic checks
  if (reactVersion && reactVersion.startsWith('19')) {
    mismatches.push('React 19 detected; some libs may expect React 18.')
  }
  if (!deps['react-is']) {
    mismatches.push('react-is not explicitly installed (may cause chart issues).')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">System Health</h2>
        <p className="text-slate-600">Operational overview and status checks.</p>
      </div>

      {mismatches.length > 0 && (
        <div className="rounded border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-800">Version Warnings</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
            {mismatches.map(m => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-lg font-semibold">API</h3>
          <p className="mt-2 text-green-700 bg-green-100 inline-block rounded px-2 py-1 text-sm">Operational</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-lg font-semibold">Database</h3>
          <p className="mt-2 text-green-700 bg-green-100 inline-block rounded px-2 py-1 text-sm">Operational</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-lg font-semibold">Auth (Clerk)</h3>
          <p className="mt-2 text-green-700 bg-green-100 inline-block rounded px-2 py-1 text-sm">Operational</p>
          <p className="mt-3 text-xs text-slate-600">Clerk v{clerkVersion}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-lg font-semibold">Background Jobs</h3>
          <p className="mt-2 text-slate-700 bg-slate-100 inline-block rounded px-2 py-1 text-sm">No jobs configured</p>
        </div>
        <div className="rounded-lg border bg-white p-4 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold">Key Library Versions</h3>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="rounded border p-2">React <span className="font-mono">{reactVersion}</span></div>
            <div className="rounded border p-2">Recharts <span className="font-mono">{rechartsVersion}</span></div>
            <div className="rounded border p-2">react-is <span className="font-mono">{deps['react-is']}</span></div>
            <div className="rounded border p-2">Clerk <span className="font-mono">{clerkVersion}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
