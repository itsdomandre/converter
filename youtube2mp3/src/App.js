import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!url) {
      alert('Por favor, insira um link do YouTube.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/download', { url }, { responseType: 'blob' });
      
      // Cria o link para o download
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = response.headers['content-disposition'].split('=')[1].replace(/"/g, '');
      link.click();
    } catch (err) {
      setError('Ocorreu um erro ao tentar converter o vídeo. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Converter YouTube para MP3</h1>
      <input
        type="text"
        placeholder="Cole o link do YouTube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Carregando...' : 'Baixar MP3'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
