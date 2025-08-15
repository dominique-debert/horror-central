// src/app/page.tsx
export default function Home() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        Welcome to <span className="text-primary">Horror Central</span>
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
        Discover, review, and track your favorite horror movies, TV shows, and games.
      </p>
    </div>
  )
}