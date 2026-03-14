async function run() {
  const q = `query { posts(first: 1) { nodes { id slug uri } } }`;
  const res = await fetch('https://prince.explainur.com/graphql', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  console.log(await res.text());
}
run();
