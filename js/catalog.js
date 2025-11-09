// Simple comics data (edit this array to add/remove comics)
const comics = [
    {
        id: 2,
        title: 'um',
        thumbnail: 'assets/thumbnails/um.jpg',
        pages: [
            'assets/comics/um/Frame 1.mp4'
        ]
    },

    {
        id: 1,
        title: 'sand',
        thumbnail: 'assets/thumbnails/sand.jpg',
        pages: [
            'assets/comics/sand/Frame 1.mp4',
            'assets/comics/sand/Frame 2.mp4',
            'assets/comics/sand/Frame 3.mp4'
        ]
    }
];

// Small inline SVG placeholder used when thumbnail cannot be loaded
const PLACEHOLDER_DATA_URI = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
  <rect width="100%" height="100%" fill="#2d2d2d" />
  <text x="50%" y="50%" font-size="24" fill="#999" dominant-baseline="middle" text-anchor="middle">Imagem indisponível</text>
</svg>
`);

function showCatalogMessage(message) {
    const catalog = document.getElementById('comic-catalog');
    if (!catalog) return;
    // Remove any previous messages
    const prev = document.getElementById('catalog-message');
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.id = 'catalog-message';
    el.style.padding = '2rem';
    el.style.color = '#fff';
    el.style.textAlign = 'center';
    el.textContent = message;
    catalog.appendChild(el);
}

function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';

    // Build elements explicitly to attach error handlers
    const img = document.createElement('img');
    img.src = comic.thumbnail;
    img.alt = comic.title;
    // Fallback if thumbnail missing
    img.onerror = () => {
        console.warn('Thumbnail load failed for', comic.thumbnail);
        img.src = PLACEHOLDER_DATA_URI;
    };

    const info = document.createElement('div');
    info.className = 'comic-info';
    const h3 = document.createElement('h3');
    h3.textContent = comic.title;
    info.appendChild(h3);

    card.appendChild(img);
    card.appendChild(info);

    card.addEventListener('click', () => {
        try {
            localStorage.setItem('currentComic', JSON.stringify(comic));
            window.location.href = 'viewer.html';
        } catch (err) {
            console.error('Erro ao selecionar comic:', err);
            showCatalogMessage('Não foi possível abrir o comic — verifique o console.');
        }
    });

    return card;
}

function initializeCatalog() {
    const catalogElement = document.getElementById('comic-catalog');
    if (!catalogElement) {
        console.error('Elemento #comic-catalog não encontrado em index.html');
        return;
    }

    try {
        if (!Array.isArray(comics) || comics.length === 0) {
            showCatalogMessage('Nenhum comic disponível. Edite js/catalog.js para adicionar comics.');
            return;
        }

        // Clear existing children (useful during live edits)
        catalogElement.innerHTML = '';

        comics.forEach(comic => {
            catalogElement.appendChild(createComicCard(comic));
        });
    } catch (err) {
        console.error('Erro ao inicializar catálogo:', err);
        showCatalogMessage('Ocorreu um erro ao carregar o catálogo. Veja o console para detalhes.');
    }
}

// Initialize the catalog when the page loads
document.addEventListener('DOMContentLoaded', initializeCatalog);