import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  console.log(text);
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Placeholder for summarization logic
    // This could be an API call to a summarization service
    const summary = `Summary of: ${text}`; // Replace with actual summarization logic

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
}
