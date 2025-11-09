<<<<<<< HEAD
// Configuração dos vídeos por seção
export const videoConfig = {
  sand: {
    title: "Pedaço de areia",
    videos: [
      './assets/comics/sand/Frame1.mp4',
      './assets/comics/sand/Frame2.mp4',
      './assets/comics/sand/Frame3.mp4',
      './assets/comics/sand/Frame4.mp4'
    ]
  },
  um: {
    title: "Em produção",
    videos: []
  }
};

// Estado dos vídeos
export const VideoStates = {
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
  ERROR: 'error'
};

// Função para carregar a lista de vídeos para uma seção específica
export async function loadVideoList(sectionId) {
  // Retorna a lista de vídeos configurada
  return videoConfig[sectionId]?.videos || [];
=======
// Configuração dos vídeos por seção
export const videoConfig = {
  sand: {
    title: "Pedaço de areia",
    videos: [
      './assets/comics/sand/Frame1.mp4',
      './assets/comics/sand/Frame2.mp4',
      './assets/comics/sand/Frame3.mp4',
      './assets/comics/sand/Frame4.mp4'
    ]
  },
  um: {
    title: "Em produção",
    videos: []
  }
};

// Estado dos vídeos
export const VideoStates = {
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
  ERROR: 'error'
};

// Função para carregar a lista de vídeos para uma seção específica
export async function loadVideoList(sectionId) {
  // Retorna a lista de vídeos configurada
  return videoConfig[sectionId]?.videos || [];
>>>>>>> 44a7f3b879c725c09f28c9c778173d391d17fe78
}