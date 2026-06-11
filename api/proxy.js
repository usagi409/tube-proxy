const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URLを指定してください' });
  }

  try {
    // 情報を取得
    const info = await ytdl.getInfo(url);
    
    // 【重要】filter: 'audioandvideo' で、映像と音声が含まれるものだけに絞る
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest', 
      filter: 'audioandvideo' 
    });

    if (!format || !format.url) {
      return res.status(500).json({ error: '再生可能なフォーマットが見つかりませんでした' });
    }

    // URLへリダイレクト
    res.redirect(format.url);
  } catch (err) {
    res.status(500).json({ error: '取得失敗: ' + err.message });
  }
};
