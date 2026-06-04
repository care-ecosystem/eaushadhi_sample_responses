export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    try {
      // Parse the request body to get InwardDate
      const body = await request.json();
      const inwardDate = body?.InwardDate;

      if (!inwardDate) {
        return new Response(JSON.stringify({ error: "InwardDate is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      // Convert DD/MM/YYYY → YYYY-MM-DD to match filename
      const [day, month, year] = inwardDate.split("/");
      const filename = `${year}-${month}-${day}.json`;

      // Fetch from GitHub raw
      const githubUrl = `https://raw.githubusercontent.com/care-ecosystem/eaushadhi_sample_responses/main/responses/${filename}`;
      const githubResponse = await fetch(githubUrl);

      if (!githubResponse.ok) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      const data = await githubResponse.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request", detail: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
