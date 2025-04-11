#!/bin/bash
# download_video.sh
# Recebe uma URL de vídeo e baixa a versão MP3

video_url=$1

# Usa yt-dlp para extrair o áudio em MP3 e renomear o arquivo para download-converted.mp3
yt-dlp -x --audio-format mp3 --output download-converted.%(ext)s $video_url
