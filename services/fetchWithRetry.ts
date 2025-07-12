// services/fetchWithRetry.ts
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 5,
  delay = 2000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
    } catch (e) {
      // Ignore and retry
    }
    await new Promise(r => setTimeout(r, delay));
  }
  throw new Error('Server is taking too long to respond. Please try again later.');
} 