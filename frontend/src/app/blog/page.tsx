import Image from 'next/image';
import Link from 'next/link';

// The precise GraphQL query to get posts with their featured images
const GET_POSTS_QUERY = `
  query GetAllPosts {
    posts(first: 10) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

async function fetchPosts() {
  try {
    // Check if the environment variable is actually defined
    if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
      console.warn("WARNING: NEXT_PUBLIC_WORDPRESS_API_URL is missing. Returning empty blog feed.");
      return [];
    }

    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_POSTS_QUERY }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch WordPress API:', res.statusText);
      return [];
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return [];
    }
    
    return json.data?.posts?.nodes || [];
  } catch (error) {
    console.error("FetchPosts execution error:", error);
    return [];
  }
}

export default async function BlogFeed() {
  const posts = await fetchPosts();

  return (
    <div className="min-h-screen p-8 lg:p-24 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight text-center mb-10">
        Latest Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {posts.map((post: any) => {
          // Safe fallback in case a post doesn't have a featured image
          const imageUrl = post.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/600x400?text=No+Image';
          const imageAlt = post.featuredImage?.node?.altText || post.title;

          return (
            <article key={post.id} className="border bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative w-full h-48 bg-gray-100">
                <Image 
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 text-gray-900 line-clamp-2">
                    {post.title}
                  </Link>
                </h2>
                {/* Renders the WordPress excerpt safely */}
                <div 
                  className="text-gray-600 line-clamp-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
