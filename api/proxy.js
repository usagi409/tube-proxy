// Invidious API (オープンソースのYouTubeフロントエンド) を利用する方法
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URLを指定してください' });

  // YouTubeの動画IDだけを抽出
  const videoId = url.split('v=')[1]?.split('&')[0];
  if (!videoId) return res.status(400).json({ error: '正しいURLを入力してください' });

  try {
    // Invidiousの公開インスタンス経由で動画情報を取得
    const response = await fetch(`https://invidious.jing.rocks/api/v1/videos/${videoId}`);
    const data = await response.json();

    // 再生可能なフォーマットを探す
    const format = data.formatStreams.find(f => f.type.includes('video/mp4'));
    
    if (!format) {
      return res.status(500).json({ error: '再生可能なフォーマットが見つかりませんでした' });
    }

    // 動画直リンクへリダイレクト
    res.redirect(format.url);
  } catch (err) {
    res.status(500).json({ error: '取得失敗: ' + err.message });
  }
}
