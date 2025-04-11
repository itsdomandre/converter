const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://192.168.1.70:3000',  // Permitir requisições do frontend na VM
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para realizar o download e conversão de vídeo para MP3
app.post('/download', (req, res) => {
  const videoUrl = req.body.url;

  // Executa o script bash para download e conversão do vídeo
  const downloadProcess = spawn('bash', ['./download_video.sh', videoUrl]);

  // Configura os cabeçalhos para o arquivo de resposta (MP3)
  res.header('Content-Disposition', 'attachment; filename="download-converted.mp3"');
  res.header('Content-Type', 'audio/mpeg');

  // Passa a saída do processo para o cliente (o arquivo MP3 gerado)
  downloadProcess.stdout.pipe(res);

  // Em caso de erro ao executar o script
  downloadProcess.on('error', (err) => {
    console.error('Erro ao executar o script de download:', err);
    if (!res.headersSent) {
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });

  // Caso o processo termine com erro
  downloadProcess.on('exit', (code) => {
    if (code !== 0 && !res.headersSent) {
      console.error(`Script de download terminou com erro. Código: ${code}`);
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });

  // Garantir que a resposta não seja enviada mais de uma vez
  downloadProcess.on('close', (code) => {
    if (code !== 0 && !res.headersSent) {
      res.status(500).send('Erro ao processar o vídeo.');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
