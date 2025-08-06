module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = {
      status: 'API çalışıyor!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      openaiKeyExists: !!process.env.OPENAI_API_KEY,
      openaiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      message: 'Test endpoint başarıyla çalışıyor'
    };

    console.log('Test endpoint çağrıldı:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('Test endpoint hatası:', error);
    res.status(500).json({ 
      error: 'Test endpoint hatası',
      message: error.message
    });
  }
}; 