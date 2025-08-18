interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? "").toString()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      {q ? (
        <>
          <p className="text-muted-foreground">Showing results for: <span className="text-foreground">{q}</span></p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-2 h-40 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Enter a query in the search bar to begin.</p>
      )}
    </main>
  )
}
