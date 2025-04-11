const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://192.168.1.70:3000',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;

  // Usando o yt-dlp para baixar o áudio em MP3
  const ytDlp = spawn('yt-dlp', [
    '-x', // Extrair o áudio
    '--audio-format', 'mp3', // Converter para MP3
    '--quiet', // Modo silencioso (sem logs)
    '--output', 'download-converted.%(ext)s', // Nome fixo para o arquivo
    videoUrl, // URL do vídeo
  ]);

  res.header('Content-Disposition', 'attachment; filename="download-converted.mp3"');
  res.header('Content-Type', 'audio/mpeg');

  // Verifica se o yt-dlp falhou
  ytDlp.on('error', (err) => {
    console.error('Erro ao executar yt-dlp:', err);
    if (!res.headersSent) {
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });

  // Verifica se o yt-dlp terminou com erro
  ytDlp.on('exit', (code) => {
    if (code !== 0 && !res.headersSent) {
      console.error(`yt-dlp terminou com erro. Código: ${code}`);
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });

  // Envia o stream de áudio para a resposta apenas se não houver erro
  ytDlp.stdout.pipe(res);

  // Tratando o caso de erro se não houver dados
  ytDlp.on('close', (code) => {
    if (code !== 0 && !res.headersSent) {
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
