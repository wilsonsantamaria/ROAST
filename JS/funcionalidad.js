

console.log("hola");


document.addEventListener("DOMContentLoaded", () => {
    const barra = document.querySelector(".barra-carga");
    const texto = document.querySelector("p span");


    function cargarBarra(duracionSegundos) {
        let porcentaje = 0;
        const intervalo = 100; // cada 0.1 segundos
        const incremento = 100 / (duracionSegundos * 1000 / intervalo);

        const timer = setInterval(() => {
            porcentaje += incremento;

            if (porcentaje >= 100) {
                porcentaje = 100;
                clearInterval(timer);
            }

            barra.style.background = `linear-gradient(

                to right, #c99b77 ${porcentaje}%,
                transparent ${porcentaje}
            )`;


 
            texto.textContent = Math.round(porcentaje) + "%";
        },
         intervalo);
    }

    cargarBarra(4);
});
