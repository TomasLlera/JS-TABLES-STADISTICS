fetch('https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Para verificar estructura

        if (data && Array.isArray(data.data)) {
            const personas = data.data;

            // 🟦 Población completa
            const tablaPoblacion = document.getElementById('tabla-poblacion').getElementsByTagName('tbody')[0];
            personas.forEach(p => {
                const fila = tablaPoblacion.insertRow();
                fila.innerHTML = `
                    <td>${p.nombre} ${p.apellido}</td>
                    <td>${p.Edad}</td> <!-- Asegúrate de usar p.Edad -->
                    <td>${p.curso}</td>
                    <td>${p.nivel}</td>
                `;
            });

            // 🟦 Función para calcular frecuencias
            function calcularFrecuencia(array) {
                const frecuencia = {};
                array.forEach(item => {
                    if (item !== undefined && item !== null) {
                        frecuencia[item] = (frecuencia[item] || 0) + 1;
                    }
                });
                return frecuencia;
            }

            // 🟦 Tablas de frecuencia
            const nivelesEducativos = personas.map(p => p.nivel);
            const cursosSecundarios = personas
                .filter(p => p.nivel === 'Secundario')
                .map(p => p.curso);

            // 🔹 Frecuencia niveles educativos
            const tablaFrecuenciaNiveles = document.getElementById('tabla-frecuencia-niveles').getElementsByTagName('tbody')[0];
            const frecuenciasNiveles = calcularFrecuencia(nivelesEducativos);
            let acumuladaNivel = 0;
            for (const [nivel, freq] of Object.entries(frecuenciasNiveles)) {
                acumuladaNivel += freq;
                const fila = tablaFrecuenciaNiveles.insertRow();
                fila.innerHTML = `
                    <td>${nivel}</td>
                    <td>${freq}</td>
                    <td>${acumuladaNivel}</td>
                    <td>${(freq / personas.length).toFixed(4)}</td>
                `;
            }

            // 🔹 Frecuencia cursos (solo secundario)
            const tablaFrecuenciaCursos = document.getElementById('tabla-frecuencia-cursos').getElementsByTagName('tbody')[0];
            const frecuenciasCursos = calcularFrecuencia(cursosSecundarios);
            let acumuladaCurso = 0;
            for (const [curso, freq] of Object.entries(frecuenciasCursos)) {
                acumuladaCurso += freq;
                const fila = tablaFrecuenciaCursos.insertRow();
                fila.innerHTML = `
                    <td>${curso}</td>
                    <td>${freq}</td>
                    <td>${acumuladaCurso}</td>
                    <td>${(freq / cursosSecundarios.length).toFixed(4)}</td>
                `;
            }

            // 🟦 Estadísticos de Edad
            const edades = personas
                .map(p => {
                    const edad = parseInt(p.Edad); // Asegurarnos de que estamos extrayendo correctamente la edad
                    console.log(`Edad de ${p.nombre} ${p.apellido}: ${edad}`); // Imprime cada edad para depuración
                    return edad;
                })
                .filter(e => !isNaN(e));  // Filtramos los valores no numéricos

            console.log("Edades filtradas: ", edades);  // Imprime todas las edades filtradas

            function median(array) {
                const sorted = [...array].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 !== 0
                    ? sorted[mid]
                    : (sorted[mid - 1] + sorted[mid]) / 2;
            }

            function cuartil(array, q) {
                const sorted = [...array].sort((a, b) => a - b);
                const pos = (sorted.length - 1) * q;
                const base = Math.floor(pos);
                const resto = pos - base;
                return sorted[base] + resto * (sorted[base + 1] - sorted[base]);
            }

            function desviacionEstandar(array) {
                const media = array.reduce((a, b) => a + b, 0) / array.length;
                const varianza = array.reduce((a, b) => a + Math.pow(b - media, 2), 0) / array.length;
                return Math.sqrt(varianza);
            }

            const estadisticos = {
                media: (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(2),
                mediana: median(edades).toFixed(2),
                minimo: Math.min(...edades),
                maximo: Math.max(...edades),
                primerCuartil: cuartil(edades, 0.25).toFixed(2),
                segundoCuartil: cuartil(edades, 0.5).toFixed(2),
                desviacionEstandar: desviacionEstandar(edades).toFixed(2)
            };

            const nombresEstadisticos = {
                media: 'Media',
                mediana: 'Mediana',
                minimo: 'Valor Mínimo',
                maximo: 'Valor Máximo',
                primerCuartil: 'Primer Cuartil (Q1)',
                segundoCuartil: 'Segundo Cuartil (Q2)',
                desviacionEstandar: 'Desvío Estándar'
            };

            const ordenEstadisticos = [
                'media',
                'mediana',
                'minimo',
                'maximo',
                'primerCuartil',
                'segundoCuartil',
                'desviacionEstandar'
            ];

            const tablaEstadisticos = document.getElementById('tabla-estadisticos').getElementsByTagName('tbody')[0];
            ordenEstadisticos.forEach(clave => {
                const fila = tablaEstadisticos.insertRow();
                fila.innerHTML = `
                    <td>${nombresEstadisticos[clave]}</td>
                    <td>${estadisticos[clave]}</td>
                `;
            });

        } else {
            console.error('La propiedad "data" no es un array válido:', data);
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos de la API:', error);
    });
