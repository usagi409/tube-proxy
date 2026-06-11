const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'URLを指定してください' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    
    // 取得した動画リンクへ転送
    res.redirect(format.url);
  } catch (err) {
    res.status(500).json({ error: '取得失敗: ' + err.message });
  }
};
