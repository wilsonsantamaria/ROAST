

console.log("hola");


// esa parte de codigo es la anicion de la carga del a 1 a 100
document.addEventListener("DOMContentLoaded", () => {
    const barra = document.querySelector(".barra-carga");
    const texto = document.querySelector("p span");
    const carga = document.querySelector(".pantalla-carga");
    const inicio = document.querySelector(".pantalla-inicio");


    function cargarBarra(duracionSegundos) {
        let porcentaje = 0;
        const intervalo = 100; // cada 0.1 segundos
        const incremento = 100 / (duracionSegundos * 1000 / intervalo);

        const timer = setInterval(() => {
            porcentaje += incremento;

            if (porcentaje >= 100) {
                porcentaje = 100;
                clearInterval(timer);

                carga.style.display="none";
                inicio.style.display="flex";


            }

            barra.style.background = `linear-gradient(
                to right, 
                #c98677 ${porcentaje}%,
                transparent ${porcentaje}
            )`;


 
            texto.textContent = Math.round(porcentaje) + "%";
        },
         intervalo);
    }

    cargarBarra(4);
});






const canvas = document.body.appendChild(document.createElement("canvas"));
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
Object.assign(canvas.style, { position: "fixed", inset: 0, zIndex: -1 });

let chispas = [];
const inicio = performance.now();
let id;

function animar(t) {
  // Estela oscura
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

  if (t - inicio < 4000) id = requestAnimationFrame(animar);
  else canvas.remove(); 
}

id = requestAnimationFrame(animar);


