const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).send('URL inválida do YouTube');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    console.log('Informações do vídeo:', info.videoDetails.title);

    const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
    const fileName = `${info.videoDetails.title}.mp3`.replace(/[\/\\?%*:|"<>\.]/g, '-');

    res.header('Content-Disposition', `attachment; filename="${fileName}"`);
    res.header('Content-Type', 'audio/mpeg');

    audioStream.pipe(res);
  } catch (error) {
    console.error('Erro ao baixar vídeo:', error.message || error);
    res.status(500).send(`Erro ao processar o vídeo: ${error.message || error}`);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
