# 📘 Lectum

**Lectum** es un dashboard académico moderno diseñado para gestionar **materias, notas, eventos y materiales de estudio** de forma clara, ordenada y flexible. Está pensado para estudiantes que quieren control real sobre su rendimiento académico, sin hojas de cálculo caóticas ni apps infladas.

La idea es poder registrar tus notas sin depender de que el profesor las suba a otra plataforma, revisar semestres anteriores, anticipar resultados y mantener tus recursos académicos en un solo lugar.

## ✨ Características principales

* 📚 **Gestión de materias y notas**

  * Organización por grupo, año o semestre.
  * Registro de docente, color, modo de cálculo y créditos por materia.
  * Edición del nombre de una materia y del grupo o semestre al que pertenece.
  * Renombrado de grupos semestrales desde Configuración.
  * Visualización clara de notas sólidas y notas control.
  * Edición rápida directamente desde cada tarjeta de nota.

* 🧮 **Múltiples modos de cálculo**

  * Promedio simple.
  * Cálculo porcentual.
  * Media geométrica.
  * Cambio de modo según la exigencia de cada materia.

* ⚖️ **Ponderaciones por créditos**

  * Configuración opcional para que cada materia afecte el promedio general según sus créditos o peso académico.
  * Los créditos no necesitan sumar 100: Lectum calcula la proporción automáticamente.
  * El dashboard puede mostrar la materia con mayor peso del grupo.

* ✖️ **Multiplicador de nota por materia**

  * Activa un multiplicador únicamente en las materias que lo necesiten.
  * Admite valores con hasta cuatro decimales.
  * Muestra tanto el promedio base como el resultado final ajustado.

* ✅ **Nota aprobatoria configurable**

  * Define una nota mínima de aprobación.
  * Personaliza colores para notas aprobadas y reprobadas.
  * Decide dónde aplicar los colores: dashboard, materias, notas o componentes.

* 🧩 **Notas control y componentes**

  * Las notas control se calculan desde varios componentes.
  * Los componentes se pueden agregar directamente desde la tarjeta de la nota.
  * Reordenamiento por arrastre.
  * Edición inline de nombres y valores.
  * Opción de descartar componentes sin eliminarlos definitivamente.

* 🗂️ **Descartar sin borrar**

  * Las notas pueden descartarse para que no cuenten en el promedio.
  * Los componentes también pueden descartarse dentro de una nota control.
  * Todo puede reintegrarse después si es necesario.

* 📅 **Eventos y calendario**

  * Registro de pruebas, entregas, exposiciones o recordatorios.
  * Cada evento puede incluir materia, fecha, hora y temario.
  * Calendario mensual con navegación.
  * Panel de próximo evento y lista de próximos eventos.
  * Los eventos pasados no aparecen como próximos al importar respaldos.
  * Historial de eventos al seleccionar una fecha pasada en el calendario.

* 📎 **Archivos por materia**

  * Sube apuntes, materiales o documentos relacionados con cada materia.
  * Visualiza imágenes, PDF, archivos de texto, audios y videos sin descargarlos nuevamente.
  * Word, Excel, PowerPoint y archivos comprimidos mantienen la opción de descarga porque los navegadores no pueden representarlos directamente.
  * Descarga archivos desde la tarjeta correspondiente.
  * Reordena materiales por arrastre.
  * Interfaz de carga más clara, mostrando el archivo seleccionado.

* 🔗 **Links rápidos**

  * Guarda accesos directos a plataformas universitarias o recursos útiles.
  * Soporte para favicon, emoji o imagen personalizada.

* 🎭 **Temas de apariencia**

  * Modos claro, oscuro y rosado.
  * El modo rosado incorpora degradados, iluminación ambiental y animaciones sutiles.
  * El tema seleccionado se conserva al volver a abrir Lectum.

* 💾 **Almacenamiento local**

  * Las notas y configuraciones se guardan mediante LocalStorage.
  * Los archivos de materias utilizan IndexedDB para admitir contenidos de mayor tamaño.
  * Toda la información permanece local en el navegador y no se envía a servicios externos.
  * No se pierde información al recargar o cerrar la página.
  * Lectum recuerda el último grupo o semestre que estaba abierto.

* 📤 **Exportación e importación JSON**

  * Exporta materias, notas, componentes, archivos, eventos, links, tema, logo y configuración.
  * Importa respaldos para mover tus datos a otro navegador o dispositivo.
  * Compatible con respaldos antiguos.

* 🎨 **Personalización**

  * Logo personalizable.
  * Colores por materia.
  * Configuración de ponderaciones, nota aprobatoria y zonas coloreadas.

* 📱 **Diseño adaptable**

  * Distribución optimizada para computador y celular.
  * En móviles se priorizan el resumen, el próximo evento y las materias.

## 🚀 Cómo usar Lectum

Lectum no requiere instalación, servidor ni dependencias externas:

1. Descarga o clona el proyecto.
2. Abre `index.html` en un navegador moderno.
3. Crea un grupo o semestre y comienza a registrar tus materias.

Los datos permanecen en el navegador donde utilizas Lectum. Para trasladarlos a otro dispositivo o evitar pérdidas al limpiar los datos del navegador, utiliza las opciones **Exportar JSON** e **Importar JSON** de Configuración.

## 📁 Estructura del proyecto

* `index.html`: estructura principal de la aplicación.
* `styles.css`: diseño, temas y adaptación para móviles.
* `app.js`: gestión de datos, cálculos e interacciones.
* `img/`: logotipos y recursos gráficos.

## 🎯 Objetivo del proyecto

Lectum busca ser una herramienta **simple pero potente**, enfocada en lo esencial:
entender tus notas, anticiparte a los resultados y tomar mejores decisiones académicas.

No intenta reemplazar sistemas institucionales, sino **darle al estudiante control real** sobre su información académica.

## 🛠️ Tecnologías utilizadas

* HTML
* CSS
* JavaScript
* LocalStorage e IndexedDB para persistencia de datos

Sin backend, sin cuentas y sin dependencias externas obligatorias.

## 🚀 Estado del proyecto

📌 En desarrollo / iteración continua.

Mejoras posibles:

* Más visualizaciones y estadísticas.
* Más opciones de personalización.
* Optimización de experiencia de usuario.
* Mejoras de accesibilidad.
* Respaldo y migración de datos más avanzados.

## 📄 Licencia

Proyecto personal de uso académico.

Puedes utilizar Lectum para gestionar tus datos académicos. No se autoriza replicar, redistribuir o promocionar el proyecto como propio sin permiso del autor.

Tú mandas, wn 🔥
