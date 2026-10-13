# Invitación Bodas de Oro · José & Noemí

Sitio estático (HTML + CSS + JS, sin frameworks): `index.html`, `styles.css`, `app.js`.

## Probar en local
Abre `index.html` en el navegador, o con servidor: `python -m http.server` y visita `http://localhost:8000/index.html?boleto=DEMO1`.

## Qué editar
Todo está al inicio de `app.js`: nombres, fecha, hora de la cuenta regresiva, lugar, dirección, horarios, enlace de Google Maps, WhatsApp, frase y padrinos (arrays). Busca los textos `[PENDIENTE]` y `[VERIFICAR]`.

## Imágenes (carpeta `assets/`)
Reemplaza con tus archivos, con estos nombres exactos (si falta alguna, el sitio sigue funcionando con un fondo de color o un placeholder):

| Archivo | Uso |
|---|---|
| `papel.jpg` | Textura crema de fondo (también se mezcla con el dorado) |
| `papel-blanco.jpg` | Textura de las tarjetas blancas |
| `eucalipto-1.png`, `eucalipto-2.png` | Acuarelas de eucalipto, PNG transparente |
| `hortensia.png` | Flores de las esquinas, PNG transparente |
| `pareja.jpg` | Foto del hero (proporción 4:5) |
| `musica.mp3` | Opcional. Si no existe, el reproductor no aparece |

## Boletos y Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com), añade una app Web y copia su configuración a `firebaseConfig` en `app.js`.
2. Crea la base **Firestore** y, en *Reglas*, pega:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boletos/{code} {
      allow get: if true;       // solo se puede leer un boleto conociendo su código
      allow list: if false;     // nadie puede listar la colección
      allow create, delete: if false;
      allow update: if resource.data.answer == null          // solo una respuesta
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly(['answer', 'attendees', 'note', 'answeredAt'])
        && request.resource.data.answer in ['yes', 'no']
        && request.resource.data.attendees is int
        && request.resource.data.attendees >= 0
        && request.resource.data.attendees <= resource.data.passes
        && (request.resource.data.answer == 'no'
              ? request.resource.data.attendees == 0
              : request.resource.data.attendees >= 1)
        && request.resource.data.note is string
        && request.resource.data.note.size() <= 300
        && request.resource.data.answeredAt == request.time;
    }
  }
}
```
3. **Crear boletos**: en Firestore, colección `boletos`, un documento por invitado. El **ID del documento es el código** (usa uno largo y difícil de adivinar, p. ej. `K7Q2-M9XP`, solo letras, números, `-` y `_`). Campos:
   - `name` (string): "Familia Pérez"
   - `passes` (number): lugares reservados, p. ej. 4
   - `answer` (null), `attendees` (null), `note` (string vacío ""), `answeredAt` (null)

   Es obligatorio que `answer` exista como `null`. Enlace para el invitado: `https://tu-sitio/index.html?boleto=K7Q2-M9XP`.
4. Las respuestas se ven en la consola de Firestore (`answer`: yes/no, `attendees`, `note`, `answeredAt`).

Sin Firebase configurado, se usa `BOLETOS_LOCALES` (ejemplos `DEMO1`, `DEMO2`) y la respuesta se envía por WhatsApp.

## Publicar
Sube la carpeta completa a cualquier hosting estático: GitHub Pages, Netlify (arrastrar la carpeta), Cloudflare Pages o Firebase Hosting. Necesita HTTPS. Comparte a cada invitado su enlace personal.
