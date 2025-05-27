const url = 'https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1';  // URL de la API

function loadEncuesta() {  // Función de carga datos desde la API 
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url); // Petición GET a la URL
        xhr.responseType = 'json'; // Tipo de respuesta JSON
        xhr.onload = () => {
            if (xhr.status === 200) { // Si la respuesta es exitosa (código 200)
                resolve(xhr.response); // Resolvemos la promesa con los datos
            } else {
                reject(Error(`Error: ${xhr.status} - ${xhr.statusText}`)); // Si no es exitoso, error
            }
        };
        xhr.onerror = () => reject(Error('Error: network error')); // Captura errores de red
        xhr.send(); // Envía la petición si esta todo ok
    });
}

function calcularFrecuencia(array) {  // Calcula frecuencias absolutas de elementos en un array
    const frecuencia = {};
    array.forEach(item => {
        if (item !== undefined && item !== null) { // Ignora valores indefinidos o nulos
            frecuencia[item] = (frecuencia[item] || 0) + 1; // Cuenta la ocurrencia de cada elemento
        }
    });
    return frecuencia; // Devuelve el objeto {elemento: frecuencia}
}

function median(array) {  // Calcula la mediana de un array numérico
    const sorted = [...array].sort((a, b) => a - b); // Copia y ordena ascendentemente
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid] // Si impar, devuelve el del medio
        : (sorted[mid - 1] + sorted[mid]) / 2; // Si par, promedia los dos centrales
}

function cuartil(array, q) {  // Calcula el cuartil q (0-1) de un array numérico
    const sorted = [...array].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q; // Posición exacta en el array ordenado
    const base = Math.floor(pos); // Parte entera
    const resto = pos - base; // Parte decimal para interpolar
    return sorted[base] + resto * (sorted[base + 1] - sorted[base]); // Interpolación lineal
}

function desviacionEstandar(array) {  // Calcula la desviación estándar de un array numérico
    const media = array.reduce((a, b) => a + b, 0) / array.length; // Media aritmética
    const varianza = array.reduce((a, b) => a + Math.pow(b - media, 2), 0) / array.length; // Varianza
    return Math.sqrt(varianza); // Raíz cuadrada de la varianza
}

function renderTablas(data) {  // Renderiza los datos en las tablas del HTML
    if (!data || !Array.isArray(data.data)) { // Validación básica del formato de datos
        console.error('Respuesta inválida:', data);
        return;
    }

    const personas = data.data;

    // Población Completa: rellena tabla con nombre, edad, curso y nivel
    const tbodyPoblacion = document.querySelector('#tabla-poblacion tbody');
    tbodyPoblacion.innerHTML = '';
    personas.forEach(p => {
        const fila = tbodyPoblacion.insertRow();
        fila.innerHTML = `
            <td>${p.nombre} ${p.apellido}</td>
            <td>${p.Edad}</td>
            <td>${p.curso}</td>
            <td>${p.nivel}</td>
        `;
    });

    // Prepara datos para frecuencia: niveles educativos y cursos (solo Secundario)
    const nivelesEducativos = personas.map(p => p.nivel);
    const cursosSecundarios = personas.filter(p => p.nivel === 'Secundario').map(p => p.curso);

    // Tabla de frecuencia niveles educativos con acumulados y relativa
    const frecuenciasNiveles = calcularFrecuencia(nivelesEducativos);
    const tbodyFrecuenciaNiveles = document.querySelector('#tabla-frecuencia-niveles tbody');
    tbodyFrecuenciaNiveles.innerHTML = '';
    let acumuladaNivel = 0;
    for (const [nivel, freq] of Object.entries(frecuenciasNiveles)) {
        acumuladaNivel += freq; // Suma acumulada de frecuencias
        const fila = tbodyFrecuenciaNiveles.insertRow();
        fila.innerHTML = `
            <td>${nivel}</td>
            <td>${freq}</td>
            <td>${acumuladaNivel}</td>
            <td>${(freq / personas.length).toFixed(4)}</td> <!-- Frecuencia relativa -->
        `;
    }

    // Tabla de frecuencia cursos con acumulados y relativa (solo nivel Secundario)
    const frecuenciasCursos = calcularFrecuencia(cursosSecundarios);
    const tbodyFrecuenciaCursos = document.querySelector('#tabla-frecuencia-cursos tbody');
    tbodyFrecuenciaCursos.innerHTML = '';
    let acumuladaCurso = 0;
    for (const [curso, freq] of Object.entries(frecuenciasCursos)) {
        acumuladaCurso += freq; // Suma acumulada de frecuencias
        const fila = tbodyFrecuenciaCursos.insertRow();
        fila.innerHTML = `
            <td>${curso}</td>
            <td>${freq}</td>
            <td>${acumuladaCurso}</td>
            <td>${(freq / cursosSecundarios.length).toFixed(4)}</td> <!-- Frecuencia relativa -->
        `;
    }

    // Estadísticos descriptivos sobre la edad: media, mediana, cuartiles, etc.
    const edades = personas
        .map(p => parseInt(p.Edad))
        .filter(e => !isNaN(e)); // Solo edades válidas

    const estadisticos = {
        media: (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(2),
        mediana: median(edades).toFixed(2),
        minimo: Math.min(...edades),
        maximo: Math.max(...edades),
        primerCuartil: cuartil(edades, 0.25).toFixed(2),
        segundoCuartil: cuartil(edades, 0.5).toFixed(2),
        desviacionEstandar: desviacionEstandar(edades).toFixed(2)
    };

    // Nombres para mostrar en la tabla
    const nombresEstadisticos = {
        media: 'Media',
        mediana: 'Mediana',
        minimo: 'Valor Mínimo',
        maximo: 'Valor Máximo',
        primerCuartil: 'Primer Cuartil (Q1)',
        segundoCuartil: 'Segundo Cuartil (Q2)',
        desviacionEstandar: 'Desvío Estándar'
    };

    const ordenEstadisticos = [ // Orden de presentación en la tabla
        'media',
        'mediana',
        'minimo',
        'maximo',
        'primerCuartil',
        'segundoCuartil',
        'desviacionEstandar'
    ];

    // Completa la tabla de estadísticos
    const tbodyEstadisticos = document.querySelector('#tabla-estadisticos tbody');
    tbodyEstadisticos.innerHTML = '';
    ordenEstadisticos.forEach(clave => {
        const fila = tbodyEstadisticos.insertRow();
        fila.innerHTML = `
            <td>${nombresEstadisticos[clave]}</td>
            <td>${estadisticos[clave]}</td>
        `;
    });
}

function init() {  // Función inicial que arranca la carga y renderizado de la encuesta
    loadEncuesta()
        .then(data => renderTablas(data)) // Si esta ok, renderiza tablas
        .catch(err => console.error('Error cargando la encuesta:', err)); // Si hay error, muestra en consola
}

// Ejecuta init cuando el DOM está listo
document.addEventListener('DOMContentLoaded', init);
