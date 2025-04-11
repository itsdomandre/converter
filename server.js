const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const port = 5000;

app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;
    
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).send('URL inválida do YouTube');
    }
  
    try {
      const info = await ytdl.getInfo(videoUrl);
      const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
      
      const fileName = `${info.videoDetails.title}.mp3`.replace(/[\/\\?%*:|"<>\.]/g, '-');  // Para evitar caracteres inválidos no nome do arquivo
  
      res.header('Content-Disposition', `attachment; filename="${fileName}"`);
      res.header('Content-Type', 'audio/mpeg');
      
      audioStream.pipe(res);
    } catch (error) {
      console.error('Erro ao baixar vídeo:', error);  // Mostra o erro completo no console
      res.status(500).send(`Erro ao processar o vídeo: ${error.message || error}`);
    }
  });
  