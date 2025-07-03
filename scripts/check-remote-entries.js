const fetch = require('node-fetch');

const remotes = [
  'https://ai-taskwizard-kanban.vercel.app/remoteEntry.js',
  // Add more remoteEntry.js URLs as needed
];

(async () => {
  for (const url of remotes) {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('javascript')) {
        console.warn(`⚠️  ${url} does not return JavaScript! Content-Type: ${contentType}`);
      } else {
        console.log(`✅  ${url} OK`);
      }
    } catch (err) {
      console.error(`❌  Failed to fetch ${url}:`, err.message);
    }
  }
})();