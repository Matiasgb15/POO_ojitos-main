Plan guardado para modificar la aplicación
He convertido la lógica del diagrama en un plan concreto y en un prompt claro para aplicar a tu app.

Prompt recomendado
"Convierte esta aplicación de p5.js y MediaPipe FaceMesh en un juego de preguntas verdadero/falso. Cuando no se detecta rostro, muestra el texto '¿Quién quiere ser millonario?'. Al detectar un rostro, genera una pregunta verdadero/falso al azar. Usa el lado izquierdo del rostro como respuesta 'verdadero' y el lado derecho como respuesta 'falso'. Si la respuesta es correcta, pinta el fondo de verde y suma puntos; si es incorrecta, pinta el fondo de rojo y resta puntos. El juego debe terminar cuando el marcador llegue a 10. Mantén la clase FiguraOjos para dibujar los ojos sobre la posición del rostro."

Archivos a modificar
sketch.js
index.html (solo para referencias/dependencias si es necesario)
style.css (si quieres ajustar apariencia de texto o canvas)
Verificación
Sin rostro, mostrar mensaje inicial.
Con rostro, mostrar pregunta.
Izquierda = verdadero, derecha = falso.
Fondo verde/rojo según acierto/error.
Juego termina al llegar a 10 puntos.
Si quieres, puedo seguir con un diseño paso a paso aún más detallado o preparar el primer cambio en sketch.js.