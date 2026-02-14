// DATOS DE LOS VIAJES (Tus datos personalizados con la propiedad 'bg' añadida)
const data = [
    { 
        t: "Finca de Liñares, Abegondo", 
        d: "La primera vez que convivimos juntos", 
        img: "img/finca_charlie.jpeg", 
        bg: "img/fondos/9781477_orig.jpg" 
    },
    { 
        t: "Fisterra, A Coruña", 
        d: "Mucho Mario Kart y playita", 
        img: "img/fisterra.jpeg", 
        bg: "img/fondos/Vista_Fisterra.jpg" 
    },
    { 
        t: "Val de San Vicent, Cantabria", 
        d: "Tiendas de camapaña y mucha lluvia", 
        img: "img/cantabria.jpeg", 
        bg: "img/fondos/kampaoh-las-arenas-general-126e0435.jpg" 
    },
    { 
        t: "Illas Cíes, Vigo", 
        d: "Escapada antes de empezar las clases", 
        img: "img/illas_cies.jpeg", 
        bg: "img/fondos/illascieswallpaper.jpg" 
    },
    { 
        t: "Isla de Santa Clara, Donosti", 
        d: "Después de tantos años, al final fuimos", 
        img: "img/isla_donosti.jpeg", 
        bg: "img/fondos/barco-a-la-isla-rutas-en-barco-en-Donostia-San-Sebastian-1024x656.jpg" 
    },
    { 
        t: "Barcelona, Cataluña", 
        d: "Best regalo ever", 
        img: "img/barcelona.jpeg", 
        bg: "img/fondos/park-guell-1.jpg" 
    }
];

// Empezamos en un número alto para permitir ir hacia atrás muchas veces
let activeIndex = Math.floor(data.length * 100); 

const container = document.getElementById('list');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('desc');
// NUEVO: Seleccionamos el elemento del fondo
const bgEl = document.getElementById('dynamic-bg');

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

    // --- NUEVO CÓDIGO PARA ACTUALIZAR EL FONDO ---
    const dataIndex = getMod(activeIndex, len);
    
    // Cambiamos la imagen del fondo
    if(bgEl) {
        bgEl.style.backgroundImage = `url(${data[dataIndex].bg})`;
    }
    
    // Actualizamos textos
    titleEl.style.opacity = 0;
    descEl.style.opacity = 0;
    
    setTimeout(() => {
        titleEl.innerText = data[dataIndex].t;
        descEl.innerText = data[dataIndex].d;
        titleEl.style.opacity = 1;
        descEl.style.opacity = 1;
    }, 200);
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