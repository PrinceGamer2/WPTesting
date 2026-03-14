import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// The GraphQL query to get all post slugs for static generation
const GET_ALL_SLUGS_QUERY = `
  query GetAllSlugs {
    posts(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

// The precise GraphQL query to get a specific post by slug
const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) {
      id
      title
      slug
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export async function generateStaticParams() {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_ALL_SLUGS_QUERY }),
  });

  const json = await res.json();
  const nodes = json?.data?.posts?.nodes || [];
  
  return nodes.map((node: { slug: string }) => ({
    slug: node.slug,
  }));
}

async function fetchPost(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_POST_BY_SLUG_QUERY,
      variables: {
        id: slug,
        idType: 'SLUG',
      },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json?.data?.post || null;
}

export default async function BlogPost(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const post = await fetchPost(params.slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/1200x600?text=No+Image';
  const imageAlt = post.featuredImage?.node?.altText || post.title;

  return (
    <article className="min-h-screen bg-white">
      {/* Featured Image Header */}
      <div className="relative w-full h-[40vh] min-h-[400px] bg-gray-100">
        <Image 
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 lg:p-24">
          <div className="max-w-4xl mx-auto w-full">
            <Link href="/blog" className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 font-medium">
              &larr; Back to Blog
            </Link>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
              {post.title}
            </h1>
            <time className="text-white/90 font-medium drop-shadow">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-8 py-16 lg:py-24">
        <div 
          className="prose prose-lg lg:prose-xl max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
}
