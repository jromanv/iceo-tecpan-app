import './globals.css'

export const metadata = {
  title: 'Liceo Tecpán - Sistema de Gestión Educativa',
  description: 'Sistema de gestión de actividades escolares',
  manifest: '/manifest.json',
  themeColor: '#570020',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Liceo Tecpán'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#570020" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Liceo Tecpán" />
      </head>
      <body className="antialiased">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker falló al registrarse:', err);
                  }
                );
              });
            }
          `
        }} />
      </body>
    </html>
  )
}