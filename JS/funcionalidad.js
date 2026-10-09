

console.log("hola");

document.addEventListener("DOMContentLoaded", () => {

    const texto = document.querySelector("p span");
    const carga = document.querySelector(".pantalla-carga");
    const inicio = document.querySelector(".pantalla-inicio");
    const barraProgreso = document.querySelector(".barra-progreso");

    const btnAyuda = document.querySelector(".btn-ayuda");
    const btnInformacion = document.querySelector(".boton-inf");
    const cerrarP = document.querySelector(".btn-cerrar");

    const sonidoBarra = document.querySelector(".sonido-ba");

    //  CARGA DE 0 A 100 
    function cargarBarra(duracionSegundos) {
        let porcentaje = 0;
        const intervalo = 100; // cada 0.1 segundos
        const incremento = 100 / (duracionSegundos * 1000 / intervalo);

        const timer = setInterval(() => {
            porcentaje += incremento;

            if (porcentaje >= 100) {
                porcentaje = 100;
                clearInterval(timer);

                sonidoBarra.pause();
                sonidoBarra.currentTime = 0;

                carga.style.display = "none";
                inicio.style.display = "flex";
            }

            barraProgreso.style.width = porcentaje + "%";
            texto.textContent = Math.round(porcentaje) + "%";
        }, intervalo);
    }


    //  MODAL DE INFORMACIÓN 
    btnAyuda.addEventListener("click", () => {
        btnInformacion.style.display = "flex";
    });

    cerrarP.addEventListener("click", () => {
        btnInformacion.style.display = "none";
    });


    //  AUDIO DE LA PANTALLA DE CARGA 
    sonidoBarra.play().catch(() => {

        // si el navegador lo bloquea, suena en el primer clic
        document.addEventListener("click", () => {
            if (carga.style.display !== "none") {
                sonidoBarra.play();
            }
        }, { once: true });
    });


    gsap.from(".pantalla-carga .roast img", {
    opacity: 0,
    y: 15,
    duration: 0.5,
    stagger: 0.5
});


    cargarBarra(4);
});


//  CHISPAS 
const canvas = document.body.appendChild(document.createElement("canvas"));
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
Object.assign(canvas.style, { position: "fixed", inset: 0, zIndex: -1 });

let chispas = [];
const tiempoInicio = performance.now();
let id;


function animar(t) {
    // estela oscura
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(20, 10, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < 4; i++) {
        chispas.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 3 + 1.5),
            r: Math.random() * 4 + 2,
            h: 10 + Math.random() * 30,
        });
    }

    chispas = chispas.filter(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.r -= 0.05;
        if (c.r <= 0) return false;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${c.h}, 100%, 55%, 0.8)`;
        ctx.fill();
        return true;
    });

    if (t - tiempoInicio < 4000) id = requestAnimationFrame(animar);
    else canvas.remove();
}

id = requestAnimationFrame(animar);