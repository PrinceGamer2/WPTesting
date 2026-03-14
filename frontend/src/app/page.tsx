import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 lg:p-24 bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl lg:text-6xl font-extrabold text-blue-900 tracking-tight text-center mb-6">
        Headless Next.js + WPGraphQL
      </h1>
      <p className="text-lg lg:text-xl text-gray-700 max-w-2xl text-center mb-10">
        This is a headless Next.js frontend consuming the WordPress GraphQL API for <span className="font-semibold text-blue-600">prince.explainur.com</span>.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/blog" 
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Blog Feed
        </Link>
      </div>
    </main>
  );
}
