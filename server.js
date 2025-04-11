const express = require('express');
const ytdl = require('youtube-dl-exec');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://192.168.1.70:3000',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;

  try {
    // Usando o yt-dlp para baixar apenas o áudio em formato mp3
    const info = await ytdl(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: '%(title)s.%(ext)s',
    });

    const fileName = "download-converted.mp3";

    res.header('Content-Disposition', `attachment; filename="${fileName}"`);
    res.header('Content-Type', 'audio/mpeg');

    const audioStream = ytdl(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: '%(title)s.%(ext)s',
    });
    audioStream.pipe(res);
  } catch (error) {
    console.error('Erro ao baixar vídeo:', error.message || error);
    console.error('Detalhes do erro:', error); 
    res.status(500).send(`Erro ao processar o vídeo: ${error.message || error}`);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
