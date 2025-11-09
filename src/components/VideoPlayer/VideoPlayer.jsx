<<<<<<< HEAD
import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { VideoStates, loadVideoList } from './videoConfig'
import './VideoPlayer.css'

function VideoPlayer() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [videoState, setVideoState] = useState(VideoStates.LOADING);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  // Carregar lista de vídeos
  useEffect(() => {
    async function loadVideos() {
      const videoList = await loadVideoList(id);
      setVideos(videoList);
    }
    loadVideos();
  }, [id]);

  // Configuração inicial do vídeo e limpeza de scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Gerenciamento de frames do motion comic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configura o vídeo para mostrar apenas um frame
    video.addEventListener('loadeddata', () => {
      video.currentTime = 0;
      video.pause();
      setVideoState(VideoStates.READY);
    });

    video.addEventListener('waiting', () => setVideoState(VideoStates.LOADING));

    // Limpa event listeners
    return () => {
      video.removeEventListener('loadeddata', () => {});
      video.removeEventListener('waiting', () => {});
    };
  }, [currentVideoIndex, videos]);

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
      setVideoState(VideoStates.LOADING);
      setAutoplay(false);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setVideoState(VideoStates.LOADING);
      setAutoplay(false);
    }
  };

  // Handler para clique/toque na área do vídeo
  const handleFrameClick = () => {
    handleNext(); // Avança para o próximo frame ao clicar
  };

  return (
    <div className="video-player">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          <span style={{ marginRight: '0.5rem' }}>←</span>
          <span>Voltar</span>
        </Link>
      </div>

      {/* Corpo principal: video + painel lateral (playlist) */}
      <div className="player-body">
        <div className="video-container">
          <div className="video-content" onClick={handleFrameClick}>
            {videos.length > 0 ? (
              <video
                ref={videoRef}
                src={videos[currentVideoIndex]}
                playsInline
                autoPlay={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onLoadedData={() => {
                  setVideoState(VideoStates.READY);
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = 0;
                    video.pause();
                  }
                }}
                onError={() => setVideoState(VideoStates.ERROR)}
              />
            ) : (
              <div className="video-placeholder">
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Carregando...
                </h2>
              </div>
            )}

            {/* Overlay de loading */}
            {videoState === VideoStates.LOADING && (
              <div className="video-overlay loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>

        <aside className="side-panel">
          <div className="playlist-header">Cenas</div>
          <ul className="playlist-list">
            {videos && videos.length > 0 ? (
              videos.map((v, idx) => {
                // Remove extensão .mp4 e usa "Cena" como prefixo
                const filename = (typeof v === 'string') ? decodeURIComponent(v.split('/').pop() || '') : '';
                const name = filename.replace(/\.mp4$/, '');
                return (
                  <li
                    key={idx}
                    className={`playlist-item ${idx === currentVideoIndex ? 'active' : ''}`}
                    onClick={() => { setCurrentVideoIndex(idx); setAutoplay(false); setVideoState(VideoStates.LOADING); }}
                  >
                    <div className="playlist-index">{idx + 1}</div>
                    <div className="playlist-title">Cena {idx + 1}</div>
                  </li>
                )
              })
            ) : (
              <li className="playlist-empty">Sem episódios</li>
            )}
          </ul>
        </aside>
      </div>

      {/* Barra de progresso */}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controles fixos na parte inferior */}
      <div className="controls-container">
        <button 
          className="control-button" 
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
          title="Cena anterior"
        >
          ←
        </button>
        <div className="frame-counter">
          {videos.length > 0 ? `${currentVideoIndex + 1}/${videos.length}` : '0/0'}
        </div>
        <button 
          className="control-button" 
          onClick={handleNext}
          disabled={currentVideoIndex === videos.length - 1}
          title="Próxima cena"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
=======
import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { VideoStates, loadVideoList } from './videoConfig'
import './VideoPlayer.css'

function VideoPlayer() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [videoState, setVideoState] = useState(VideoStates.LOADING);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  // Carregar lista de vídeos
  useEffect(() => {
    async function loadVideos() {
      const videoList = await loadVideoList(id);
      setVideos(videoList);
    }
    loadVideos();
  }, [id]);

  // Configuração inicial do vídeo e limpeza de scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Gerenciamento de frames do motion comic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configura o vídeo para mostrar apenas um frame
    video.addEventListener('loadeddata', () => {
      video.currentTime = 0;
      video.pause();
      setVideoState(VideoStates.READY);
    });

    video.addEventListener('waiting', () => setVideoState(VideoStates.LOADING));

    // Limpa event listeners
    return () => {
      video.removeEventListener('loadeddata', () => {});
      video.removeEventListener('waiting', () => {});
    };
  }, [currentVideoIndex, videos]);

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
      setVideoState(VideoStates.LOADING);
      setAutoplay(false);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setVideoState(VideoStates.LOADING);
      setAutoplay(false);
    }
  };

  // Handler para clique/toque na área do vídeo
  const handleFrameClick = () => {
    handleNext(); // Avança para o próximo frame ao clicar
  };

  return (
    <div className="video-player">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          <span style={{ marginRight: '0.5rem' }}>←</span>
          <span>Voltar</span>
        </Link>
      </div>

      {/* Corpo principal: video + painel lateral (playlist) */}
      <div className="player-body">
        <div className="video-container">
          <div className="video-content" onClick={handleFrameClick}>
            {videos.length > 0 ? (
              <video
                ref={videoRef}
                src={videos[currentVideoIndex]}
                playsInline
                autoPlay={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onLoadedData={() => {
                  setVideoState(VideoStates.READY);
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = 0;
                    video.pause();
                  }
                }}
                onError={() => setVideoState(VideoStates.ERROR)}
              />
            ) : (
              <div className="video-placeholder">
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Carregando...
                </h2>
              </div>
            )}

            {/* Overlay de loading */}
            {videoState === VideoStates.LOADING && (
              <div className="video-overlay loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>

        <aside className="side-panel">
          <div className="playlist-header">Cenas</div>
          <ul className="playlist-list">
            {videos && videos.length > 0 ? (
              videos.map((v, idx) => {
                // Remove extensão .mp4 e usa "Cena" como prefixo
                const filename = (typeof v === 'string') ? decodeURIComponent(v.split('/').pop() || '') : '';
                const name = filename.replace(/\.mp4$/, '');
                return (
                  <li
                    key={idx}
                    className={`playlist-item ${idx === currentVideoIndex ? 'active' : ''}`}
                    onClick={() => { setCurrentVideoIndex(idx); setAutoplay(false); setVideoState(VideoStates.LOADING); }}
                  >
                    <div className="playlist-index">{idx + 1}</div>
                    <div className="playlist-title">Cena {idx + 1}</div>
                  </li>
                )
              })
            ) : (
              <li className="playlist-empty">Sem episódios</li>
            )}
          </ul>
        </aside>
      </div>

      {/* Barra de progresso */}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controles fixos na parte inferior */}
      <div className="controls-container">
        <button 
          className="control-button" 
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
          title="Cena anterior"
        >
          ←
        </button>
        <div className="frame-counter">
          {videos.length > 0 ? `${currentVideoIndex + 1}/${videos.length}` : '0/0'}
        </div>
        <button 
          className="control-button" 
          onClick={handleNext}
          disabled={currentVideoIndex === videos.length - 1}
          title="Próxima cena"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
>>>>>>> 44a7f3b879c725c09f28c9c778173d391d17fe78
