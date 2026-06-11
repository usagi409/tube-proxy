export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URLを指定してください' });

  const videoId = url.split('v=')[1]?.split('&')[0];
  if (!videoId) return res.status(400).json({ error: '正しいURLを入力してください' });

  try {
    // 別のインスタンスを試す（ここを変えれば別のサーバーに繋げます）
    const response = await fetch(`https://invidious.jing.rocks/api/v1/videos/${videoId}`);
    
    // HTMLが返ってきていないか確認
    const text = await response.text();
    
    if (!response.ok) {
        return res.status(500).json({ error: `APIサーバーからのエラー: ${text.substring(0, 100)}` });
    }

    const data = JSON.parse(text);
    const format = data.formatStreams.find(f => f.type.includes('video/mp4'));
    
    if (!format) {
      return res.status(500).json({ error: '再生可能なフォーマットが見つかりませんでした' });
    }

    res.redirect(format.url);
  } catch (err) {
    res.status(500).json({ error: '接続エラー: ' + err.message });
  }
}
