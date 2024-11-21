import type { NextApiRequest, NextApiResponse } from 'next';
import ogs from 'open-graph-scraper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const { result } = await ogs({ 
      url,
      fetchOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      }
    });
    
    return res.status(200).json({
      ogTitle: result.ogTitle,
      ogDescription: result.ogDescription,
      ogImage: result.ogImage ? [{ url: result.ogImage.url }] : undefined,
      ogSiteName: result.ogSiteName,
      ogUrl: result.ogUrl,
      ogType: result.ogType,
      ogDate: result.ogDate || result.articlePublishedTime,
      ogAuthor: result.ogAuthor || result.articleAuthor,
      articlePublishedTime: result.articlePublishedTime
    });
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return res.status(500).json({ message: 'Failed to fetch link preview' });
  }
}
