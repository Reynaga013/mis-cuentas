/**
 * Service worker de Neto — solo se encarga de las notificaciones push.
 *
 * Este archivo TIENE que estar suelto en el repositorio, junto al index.html (es decir, en
 * reynaga013.github.io/mis-cuentas/firebase-messaging-sw.js). No puede ir dentro del HTML de la
 * app: los navegadores exigen que un service worker sea un archivo propio servido desde el mismo
 * sitio, porque se ejecuta en segundo plano incluso con la app cerrada — que es justo lo que hace
 * posible recibir avisos sin tener Neto abierto.
 *
 * Usa la versión "compat" de Firebase cargada desde CDN porque un service worker no puede usar
 * imports de módulos como el resto de la app.
 */

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDYVh5WZObaSjz02b0Me9UDvGbLlvU0XdI",
  authDomain: "mis-cuentas-3cb2b.firebaseapp.com",
  projectId: "mis-cuentas-3cb2b",
  storageBucket: "mis-cuentas-3cb2b.firebasestorage.app",
  messagingSenderId: "388991057868",
  appId: "1:388991057868:web:42ffee83fe555d5a02e769",
});

const messaging = firebase.messaging();

// Aviso recibido con la app cerrada o en segundo plano: se muestra como notificación del sistema.
// (Si la app está abierta, no pasa por aquí — lo maneja onMessage dentro de la propia app.)
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Neto";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { url: "./" },
  });
});

// Al tocar la notificación: si Neto ya está abierta en alguna pestaña, se trae al frente en vez de
// abrir otra copia; si no, se abre.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes("/mis-cuentas") && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
