import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
      const response = await axios.post('http://192.168.1.70:5000/download', { url }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = response.headers['content-disposition'].split('=')[1].replace(/"/g, '');
      link.click();
    } catch (err) {
      setError(`Ocorreu um erro: ${err.message || err}`);
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
        {loading ? 'Processando...' : 'Baixar MP3'}
      </button>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Por favor, aguarde...</p>}
    </div>
  );
}

export default App;
