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

  // Usando o yt-dlp para baixar apenas o áudio em MP3
  const ytDlp = spawn('yt-dlp', [
    '-x', // Extrair o áudio
    '--audio-format', 'mp3', // Converter para MP3
    '--quiet', // Modo silencioso (sem logs)
    '--output', 'download-converted.%(ext)s', // Nome fixo para o arquivo
    videoUrl, // URL do vídeo
  ]);

  res.header('Content-Disposition', 'attachment; filename="download-converted.mp3"');
  res.header('Content-Type', 'audio/mpeg');

  // O yt-dlp vai enviar o áudio para a saída padrão, que vamos enviar para o cliente
  ytDlp.stdout.pipe(res);

  // Tratar erro se ocorrer
  ytDlp.on('error', (err) => {
    console.error('Erro ao executar yt-dlp:', err);
    res.status(500).send('Erro ao processar o vídeo.');
  });

  // Tratar caso o processo termine com erro
  ytDlp.on('exit', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp terminou com erro. Código: ${code}`);
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
