const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URLを指定してください' });
  }

  try {
    // 【対策】ブラウザになりすますためのヘッダーを追加
    const requestOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };

    // 情報を取得（オプションを渡す）
    const info = await ytdl.getInfo(url, { requestOptions });
    
    // 映像と音声が含まれるものだけに絞る
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest', 
      filter: 'audioandvideo' 
    });

    if (!format || !format.url) {
      return res.status(500).json({ error: '再生可能なフォーマットが見つかりませんでした' });
    }

    res.redirect(format.url);
  } catch (err) {
    res.status(500).json({ error: '取得失敗: ' + err.message });
  }
};
