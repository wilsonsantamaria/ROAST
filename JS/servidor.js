

const express = require("express"); // es como encender el motor me permite crea la rutas 
const cors = require("cors"); // medida de segurida
const mysql = require("mysql2/promise"); // es la conexion de la bd usando node.js


const app = express(); // creo el servidor
app.use(cors()); // permitir q  otros dominios haga peticiones 
app.use(express.json()); // lo convierte peticiones a obj de js


const conexion = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", 
    database: "sistema_de_tueste_cafe"
});




// Ruta para obtener 5 preguntas al azar con sus opciones
// async Le avisa a js que aquí adentro vamos a hacer tareas que toman un poquito de tiempo
app.get("/api/preguntas", async (req, res) => {

    try {
        const cantidad = 5; 

        // 1) Traer 5 preguntas al azar de la base de datos
        const [preguntas] = await conexion.query(
            "SELECT id_pregunta, enunciado FROM pregunta ORDER BY RAND() LIMIT ?",
            [cantidad]
        );  


        if (preguntas.length === 0) { // aqui me permite verificar q si no ay pregunta se detiene  
            return res.json([]);
        }

        // 2) Obtener los IDs de esas 5 preguntas para buscar sus opciones
        //.map(). Lo que hace es recorrer el resultado de las 5 preguntas que acabamos de traer y extraer únicamente sus números de ID

        const ids = preguntas.map(p => p.id_pregunta);
        const [opciones] = await conexion.query(
            "SELECT id_pregunta, letra, texto, es_correcta FROM opcion_respuesta WHERE id_pregunta IN (?) ORDER BY letra",
            [ids]
        );


        // 3) Unir cada pregunta con sus respectivas 4 opciones
        const resultado = preguntas.map(p => ({
            id: p.id_pregunta, enunciado: p.enunciado,

            opciones: opciones
            .filter(o => o.id_pregunta === p.id_pregunta).map(o => ({//filter funciona como un guardia para me dice si tu id ocion es igual a la pregunta si si es la deja si no para fuera

            letra: o.letra,texto: o.texto, correcta: o.es_correcta === 1

                }))
        }));

        // Devolvemos el paquete listo en formato JSON
        res.json(resultado);

    } catch (error) {
        console.error("Error al obtener preguntas:", error);
        res.status(500).json({ error: "Error al obtener preguntas de la base de datos" });
    }
});

// Encender el servidor en el puerto 3000
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(` Servidor backend corriendo en http://localhost:${PUERTO}`);
});