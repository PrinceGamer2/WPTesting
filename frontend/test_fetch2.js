async function run() {
  const q = `query GetPostBySlug($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) { id title slug uri }
  }`;
  const res = await fetch('https://prince.explainur.com/graphql', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: { id: "hello-world", idType: "SLUG" } })
  });
  console.log("SLUG response:", await res.text());
  
  const res2 = await fetch('https://prince.explainur.com/graphql', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: { id: "hello-world", idType: "URI" } })
  });
  console.log("URI response:", await res2.text());
}
run();
