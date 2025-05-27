
# Proyecto Encuesta - Estadísticas y Tablas de Frecuencia

Descripción
-----------
Este proyecto carga datos de una encuesta desde una API pública y muestra la información en una página web con tres secciones principales:

1. Población Completa: Tabla con los datos de todas las personas encuestadas, mostrando nombre, edad, curso y nivel educativo.

2. Tablas de Frecuencia: Dos tablas que resumen la frecuencia de niveles educativos y cursos de los estudiantes de nivel secundario, incluyendo frecuencia absoluta, acumulada y relativa.

3. Estadísticos: Tabla con estadísticas descriptivas de la edad de los encuestados, tales como media, mediana, mínimo, máximo, cuartiles y desviación estándar.

Tecnologías
-----------
- HTML y CSS (Bootstrap para diseño responsivo)
- JavaScript (uso de XMLHttpRequest y Promesas para consumir la API)
- API pública: https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1

Cómo funciona
-------------
- Al cargar la página, el script hace una solicitud a la API para obtener los datos.
- Los datos se procesan para calcular frecuencias y estadísticas.
- Luego se generan y muestran las tablas con la información y los resultados estadísticos.
- Todo se muestra organizado en pestañas para facilitar la navegación.

