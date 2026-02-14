// DATOS DE LOS VIAJES
const data = [
    { 
        t: "Finca de Liñares, Abegondo", 
        d: "La primera vez que convivimos juntos", 
        img: "img/finca_charlie.jpeg", 
        bg: "img/fondos/9781477_orig.jpg",
        song: "audio/Don McLean - American Pie.mp3"
    },
    { 
        t: "Fisterra, A Coruña", 
        d: "Mucho Mario Kart y playita", 
        img: "img/fisterra.jpeg", 
        bg: "img/fondos/Vista_Fisterra.jpg",
        song: "audio/La Casa Por El Tejado - Fito Fitipaldis.mp3"
    },
    { 
        t: "Val de San Vicente, Cantabria", 
        d: "Tiendas de camapaña y mucha lluvia", 
        img: "img/cantabria.jpeg", 
        bg: "img/fondos/kampaoh-las-arenas-general-126e0435.jpg",
        song: "audio/Relajarse Sonidos de Lluvia.mp3"
    },
    { 
        t: "Illas Cíes, Vigo", 
        d: "Escapada antes de empezar las clases", 
        img: "img/illas_cies.jpeg", 
        bg: "img/fondos/illascieswallpaper.jpg",
        song: "audio/Luck Ra, BM - La Morocha.mp3"
    },
    { 
        t: "Isla de Santa Clara, Donosti", 
        d: "Después de tantos años, al final fuimos", 
        img: "img/isla_donosti.jpeg", 
        bg: "img/fondos/barco-a-la-isla-rutas-en-barco-en-Donostia-San-Sebastian-1024x656.jpg",
        song: "audio/Zu Zara - Autobus Magikoa.mp3" /* CORREGIDO: Añadido audio/ */
    },
    { 
        t: "Barcelona, Cataluña", 
        d: "Best regalo ever", 
        img: "img/barcelona.jpeg", 
        bg: "img/fondos/park-guell-1.jpg",
        song: "audio/Post Malone - Circles.mp3"
    }
];

// Empezamos en un número alto para permitir ir hacia atrás muchas veces
let activeIndex = Math.floor(data.length * 100); 

const container = document.getElementById('list');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('desc');
const bgEl = document.getElementById('dynamic-bg');

// CONTROL DE AUDIO GLOBAL
let currentAudio = new Audio();
currentAudio.loop = true; // Bucle infinito
currentAudio.volume = 0.5; // Volumen medio
let isSoundOn = false; // Empezamos en silencio

// Función auxiliar para obtener el módulo real
function getMod(n, m) {
    return ((n % m) + m) % m;
}

// INICIALIZACIÓN
function init() {
    container.innerHTML = "";
    data.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'coverflow-item';
        el.style.backgroundImage = `url(${item.img})`;
        
        el.onclick = () => {
            let currentMod = getMod(activeIndex, data.length);
            let diff = i - currentMod;
            
            if (diff > data.length / 2) diff -= data.length;
            if (diff < -data.length / 2) diff += data.length;

            activeIndex += diff;
            update();
        };
        container.appendChild(el);
    });
    update();
}

function update() {
    const items = document.querySelectorAll('.coverflow-item');
    const len = items.length;

    items.forEach((item, i) => {
        let pos = getMod(i - activeIndex, len);
        
        if (pos > len / 2) pos -= len;

        let transform = '';
        let zIndex = 0;
        let opacity = 0;

        if (pos === 0) {
            // CENTRAL
            transform = 'translateX(0) translateZ(0) rotateY(0)';
            zIndex = 100;
            opacity = 1;
            item.style.filter = "brightness(1.1)";
        } else {
            // LATERALES
            const x = pos * 220; 
            const z = -250; 
            const rotate = pos < 0 ? 65 : -65;

            transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotate}deg)`;
            zIndex = 50 - Math.abs(pos);
            
            opacity = Math.abs(pos) > 2 ? 0 : 0.6; 
            item.style.filter = "brightness(0.7)";
        }

        item.style.transform = transform;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
        item.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
    });

    const dataIndex = getMod(activeIndex, len);
    
    // 1. Cambiamos la imagen del fondo
    if(bgEl) {
        bgEl.style.backgroundImage = `url(${data[dataIndex].bg})`;
    }
    
    // 2. Actualizamos textos
    titleEl.style.opacity = 0;
    descEl.style.opacity = 0;
    
    setTimeout(() => {
        titleEl.innerText = data[dataIndex].t;
        descEl.innerText = data[dataIndex].d;
        titleEl.style.opacity = 1;
        descEl.style.opacity = 1;
    }, 200);

    // 3. GESTIÓN DEL AUDIO
    // Si el sonido está activado, reproducimos la canción
    if (isSoundOn) {
        playMusic(data[dataIndex].song);
    } else {
        // Si está en silencio, solo cargamos la ruta pero no damos play
        currentAudio.src = data[dataIndex].song;
    }
}

// --- FUNCIONES DE AUDIO ---

function toggleSound() {
    const iconMute = document.getElementById('icon-mute');
    const iconSound = document.getElementById('icon-sound');
    
    if (!isSoundOn) {
        // ACTIVAR SONIDO
        isSoundOn = true;
        iconMute.style.display = 'none';
        iconSound.style.display = 'block';
        
        // Reproducir la canción actual inmediatamente
        const dataIndex = getMod(activeIndex, data.length);
        playMusic(data[dataIndex].song);
    } else {
        // DESACTIVAR SONIDO (MUTE)
        isSoundOn = false;
        iconSound.style.display = 'none';
        iconMute.style.display = 'block';
        currentAudio.pause();
    }
}

function playMusic(songUrl) {
    // Si la canción ya es la misma que está sonando y no está pausada, no hacemos nada
    if (currentAudio.src.includes(encodeURI(songUrl)) && !currentAudio.paused) return;
    
    currentAudio.src = songUrl;
    currentAudio.play().catch(e => console.log("Esperando interacción para reproducir..."));
}

function next() {
    activeIndex++;
    update();
}

function prev() {
    activeIndex--;
    update();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
});

init();