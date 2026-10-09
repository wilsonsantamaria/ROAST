

console.log("hola");


// esa parte de codigo es la anicion de la carga del a 1 a 100
document.addEventListener("DOMContentLoaded", () => {
    const barra = document.querySelector(".barra-carga");
    const texto = document.querySelector("p span");
    const carga = document.querySelector(".pantalla-carga");
    const inicio = document.querySelector(".pantalla-inicio");
    const barraProgreso = document.querySelector(".barra-progreso");

    const btnAyuda= document.querySelector(".btn-ayuda");
    const btnInformacion = document.querySelector(".boton-inf");
    const cerrarP = document.querySelector(".btn-cerrar");




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
              barraProgreso.style.width = porcentaje + "%";


 
            texto.textContent = Math.round(porcentaje) + "%";
        },
         intervalo);
    }

    btnAyuda.addEventListener("click" ,() =>{

      btnInformacion.style.display="flex";


    });


    cerrarP.addEventListener("click" , () =>{

      btnInformacion.style.display=("none");

    });



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


// =====================================================================
// PANTALLA MODO APRENDIZAJE
// (todo va dentro de una funcion para no chocar con las variables de arriba)
// =====================================================================
(function () {
    const pantallaInicio = document.querySelector(".pantalla-inicio");
    const pantalla = document.querySelector(".pantalla-aprendizaje");
    // Boton que abre la pantalla: el que diga "Aprendizaje"; si no existe, el primero de "Elige tu modo de juego"
    const botonesModo = Array.from(document.querySelectorAll(".modos .boton"));
    const botonModo = botonesModo.find(function (b) { return /aprendizaje/i.test(b.textContent); }) || botonesModo[0];

    const botonInicio = pantalla.querySelector(".boton-inicio");
    const botonCancelar = pantalla.querySelector(".boton-cancelar");
    const botonEnviar = pantalla.querySelector(".boton-enviar");
    const textoProgreso = pantalla.querySelector(".progreso-texto");
    const relleno = pantalla.querySelector(".progreso-relleno");
    const resultado = pantalla.querySelector(".resultado-aprendizaje");
    const tarjetas = pantalla.querySelectorAll(".tarjeta-pregunta");

    // Respuestas correctas en orden: pregunta 1, 2, 3, 4, 5
    const respuestasCorrectas = ["B", "C", "B", "C", "B"];
    const total = tarjetas.length;
    let enviado = false;

    function abrirPantalla() {
        reiniciar();
        pantallaInicio.style.display = "none";
        pantalla.style.display = "flex";
        window.scrollTo(0, 0);
    }

    function volverAlInicio() {
        pantalla.style.display = "none";
        pantallaInicio.style.display = "flex";
        window.scrollTo(0, 0);
    }

    function contarRespondidas() {
        return pantalla.querySelectorAll("input[type=radio]:checked").length;
    }

    function actualizarProgreso() {
        const respondidas = contarRespondidas();
        const actual = Math.min(respondidas + 1, total);
        textoProgreso.textContent = "Pregunta " + actual + " de " + total;
        relleno.style.width = (actual / total * 100) + "%";
        botonEnviar.disabled = enviado || respondidas < total;
    }

    function reiniciar() {
        enviado = false;
        pantalla.querySelectorAll("input[type=radio]").forEach(function (radio) {
            radio.checked = false;
            radio.disabled = false;
        });
        pantalla.querySelectorAll(".opcion").forEach(function (opcion) {
            opcion.classList.remove("seleccionada", "correcta", "incorrecta", "bloqueada");
        });
        resultado.textContent = "";
        actualizarProgreso();
    }

    function enviarRespuestas() {
        if (enviado || contarRespondidas() < total) return;
        enviado = true;
        let aciertos = 0;

        tarjetas.forEach(function (tarjeta, i) {
            const marcada = tarjeta.querySelector("input:checked");
            const correcta = respuestasCorrectas[i];

            tarjeta.querySelectorAll("input").forEach(function (radio) {
                radio.disabled = true;
                radio.closest(".opcion").classList.add("bloqueada");
            });

            tarjeta.querySelector('input[value="' + correcta + '"]').closest(".opcion").classList.add("correcta");

            if (marcada.value === correcta) {
                aciertos++;
            } else {
                marcada.closest(".opcion").classList.remove("seleccionada");
                marcada.closest(".opcion").classList.add("incorrecta");
            }
        });

        resultado.textContent = "Obtuviste " + aciertos + " de " + total;
        botonEnviar.disabled = true;
    }

    // Al elegir una opcion se marca como seleccionada
    pantalla.addEventListener("change", function (e) {
        if (!e.target.matches("input[type=radio]")) return;
        const tarjeta = e.target.closest(".tarjeta-pregunta");
        tarjeta.querySelectorAll(".opcion").forEach(function (opcion) {
            opcion.classList.toggle("seleccionada", opcion.contains(e.target));
        });
        actualizarProgreso();
    });

    if (botonModo) botonModo.addEventListener("click", abrirPantalla);
    botonInicio.addEventListener("click", volverAlInicio);
    botonCancelar.addEventListener("click", volverAlInicio);
    botonEnviar.addEventListener("click", enviarRespuestas);

    actualizarProgreso();
})();


// =====================================================================
// VIDEO: boton ▶ de la pantalla de inicio
// (dentro de una funcion para no chocar con las variables de arriba)
// =====================================================================
(function () {
    const boton = document.querySelector(".btn-sonido");
    const modal = document.querySelector(".video-modal");
    if (!boton || !modal) return;

    const marco = modal.querySelector(".video-marco");
    const reproductor = modal.querySelector(".video-reproductor");
    const fuente = reproductor.querySelector("source");
    const cerrar = modal.querySelector(".video-cerrar");

    function abrirVideo() {
        modal.classList.add("abierto");
        modal.setAttribute("aria-hidden", "false");
        cerrar.focus();
        // Se reproduce solo al abrir (si no lo quieres, borra la siguiente linea)
        if (marco.classList.contains("con-video")) reproductor.play().catch(function () {});
    }

    function cerrarVideo() {
        reproductor.pause();
        modal.classList.remove("abierto");
        modal.setAttribute("aria-hidden", "true");
        boton.focus();
    }

    boton.addEventListener("click", abrirVideo);
    cerrar.addEventListener("click", cerrarVideo);

    // clic en el fondo oscuro (fuera del marco) tambien cierra
    modal.addEventListener("click", function (e) {
        if (e.target === modal) cerrarVideo();
    });

    // tecla Esc cierra
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("abierto")) cerrarVideo();
    });

    // Si el archivo de video existe se muestra; si no, se queda la plantilla "Aqui va tu video"
    function hayVideo() { marco.classList.add("con-video"); }
    function noHayVideo() { marco.classList.remove("con-video"); }

    reproductor.addEventListener("loadedmetadata", hayVideo);
    reproductor.addEventListener("error", noHayVideo);
    fuente.addEventListener("error", noHayVideo);
    if (reproductor.readyState >= 1) hayVideo();
})();
