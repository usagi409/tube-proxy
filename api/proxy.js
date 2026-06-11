export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URLを指定してください' });

  try {
    const response = await fetch('https://cobalt.api.red/api/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        isAudioOnly: false,
        disableMetadata: true
      })
    });

    const data = await response.json();

    if (data.status === 'error') {
      return res.status(500).json({ error: 'APIエラー: ' + data.text });
    }

    // 成功したら動画URLへリダイレクト
    res.redirect(data.url);
  } catch (err) {
    res.status(500).json({ error: '通信失敗: ' + err.message });
  }
}
