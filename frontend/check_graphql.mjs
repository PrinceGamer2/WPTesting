const apiUrl = 'https://prince.explainur.com/graphql';

async function check() {
  console.log('Fetching all posts to get slugs...');
  const allPostsQuery = `
    query GetAllSlugs {
      posts(first: 5) {
        nodes {
          slug
          title
        }
      }
    }
  `;

  const res1 = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: allPostsQuery }),
  });
  const data1 = await res1.json();
  console.log('Posts:', JSON.stringify(data1, null, 2));

  if (!data1.data?.posts?.nodes?.length) {
    console.log('No posts found!');
    return;
  }

  const firstSlug = data1.data.posts.nodes[0].slug;
  console.log(`\nFetching post by slug: ${firstSlug}`);

  const singlePostQuery = `
    query GetPostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        title
        slug
      }
    }
  `;

  const res2 = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: singlePostQuery,
      variables: {
        id: firstSlug,
        idType: 'URI', // Sometimes 'SLUG' is used, sometimes 'URI'. Let's check URI vs SLUG.
      },
    }),
  });
  
  const data2 = await res2.json();
  console.log('Single Post (URI):', JSON.stringify(data2, null, 2));

  const res3 = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: singlePostQuery,
      variables: {
        id: firstSlug,
        idType: 'SLUG',
      },
    }),
  });
  
  const data3 = await res3.json();
  console.log('Single Post (SLUG):', JSON.stringify(data3, null, 2));

}

check().catch(console.error);
