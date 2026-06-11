export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URLを指定してください' });

  const videoId = url.split('v=')[1]?.split('&')[0];
  if (!videoId) return res.status(400).json({ error: '正しいURLを入力してください' });

  try {
    // 別の安定しているInvidiousインスタンスに変更
    const response = await fetch(`https://invidious.protokolla.fi/api/v1/videos/${videoId}`);
    
    if (!response.ok) {
        throw new Error(`API接続失敗: ${response.status}`);
    }

    const data = await response.json();

    const format = data.formatStreams.find(f => f.type.includes('video/mp4'));
    if (!format) {
      return res.status(500).json({ error: '再生可能なフォーマットが見つかりませんでした' });
    }

    res.redirect(format.url);
  } catch (err) {
    // ここで詳細なエラーを出す
    res.status(500).json({ error: '詳細エラー: ' + err.message });
  }
}
