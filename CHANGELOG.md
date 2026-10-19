# Changelog

Todos los cambios notables de NoirXD se documentan aquí. **NoirXD es un fork de
[Xiaomi Debloater](https://github.com/fadeltd/xiaomi-debloater)**, creado por
Fadel Trivandi Dipantara; este historial conserva las versiones originales de ese
proyecto y le suma los cambios del fork. Las actualizaciones de la lista de
paquetes (`bloatware.json`) llegan a la app sin un release, por lo que no se listan.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/), y
este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Los encabezados de sección deciden la versión del siguiente release:
`### Ruptura` → mayor, `### Añadido` → menor, cualquier otro → parche.

## [Unreleased]

### Cambiado
- Los archivos de los releases se publican ahora con nombres fijos, sin número
  de versión (`noirxd-windows-amd64.exe`, `noirxd-macos-universal.zip`,
  `noirxd-linux-amd64.tar.gz`, `.deb` y `.rpm`, y sus variantes ARM64), así
  los enlaces de descarga directa nunca se rompen con cada release.
- La web del proyecto añade una sección Descargas, después de la guía de
  inicio, con selector por plataforma (iconos de Windows, macOS y Linux):
  al elegir una se muestra su información y sus variantes (x64, ARM64,
  `.tar.gz`, `.deb` y `.rpm`) con descarga directa al último release, más un
  enlace "Versiones" al historial de releases.

### Añadido
- Modos separados en pestañas de ancho completo (Deshabilitar y Desinstalar)
  bajo la información del dispositivo: deshabilitar solo lista apps instaladas
  que no son del sistema y desinstalar lista cualquier app; los errores de
  operación ahora muestran avisos legibles en pantalla.
  El filtro Deshabilitadas aparece solo en la pestaña Deshabilitar y el de
  Eliminadas, solo en Desinstalar.
- Las categorías de la lista son más compactas para dar más espacio a las
  aplicaciones.

## [1.2.0] — 2026-10-18

### Añadido
- Vista de inicio con la marca NoirXD: un hero con el nombre de la app, un
  resumen de lo que hace y dos tarjetas de acceso rápido (Iniciar y Guía),
  fondo cinético de varias líneas, el avatar de Dex Parker y los créditos.
- Navegación con sidebar (Debloater, Guía, Configuración) al entrar desde el
  inicio; la vista de inicio queda libre de pestañas.
- Pestaña Configuración con todo el estado del sistema: ADB (versión,
  reintentar, instalar), versión y fuente de la lista de paquetes con
  actualización, modo avanzado y dispositivos conectados.
- Iconos de cada app en la lista: avatar con las iniciales al instante y el
  icono real de Google Play cargado en segundo plano (con caché).
- Control de orden en la tabla del Debloater: nombre A ↔ Z, riesgo
  (seguro ↔ peligroso) y categoría.
- Tarjeta de ADB en la vista de inicio: detecta si ADB está instalado y, si
  no, muestra el comando de instalación más fácil para tu sistema con un botón
  de copiar, más alternativas por si ese método falla.

### Cambiado
- La pestaña de paquetes ahora se llama Debloater, y la navegación pasó de
  pestañas superiores a una sidebar con logo, Debloater, Guía y
  Configuración.
- Las acciones viven sobre la selección: marca filas y usa el panel
  contextual (Deshabilitar, Habilitar, Desinstalar o Restaurar) con una
  explicación de qué hace cada una; se quitaron los botones de cada fila.
- El registro de operaciones solo aparece en el Debloater, colapsado por
  defecto, y se despliega solo en cuanto arranca la primera acción.
- La app ahora se llama NoirXD ("Noir - Xiaomi Debloater"), incluido el título
  de la ventana y el About de macOS, con créditos al proyecto original
  Xiaomi Debloater en la app, el README y la web.
- El binario y los artefactos de release ahora se llaman `noirxd`.
- La lista de paquetes se descarga ahora de este fork
  (NOIR-DexPrkr/xiaomi-debloater) en lugar de la de upstream; usa la variable
  de entorno `NOIRXD_LIST_URL` para descargarla de otro lugar.
- Nuevo look Flat Noir en toda la app: fondos oscuros profundos, bordes de 1px,
  acentos cyan y tipografías Montserrat/Inter/JetBrains Mono.
- Toda la app ahora está en español (LatAm): interfaz, guía y mensajes de
  operación.
- Las aplicaciones marcadas como peligrosas están ocultas de la lista por
  defecto. Activa el "Modo avanzado" en la configuración para verlas y
  gestionarlas.
- Se eliminaron los canales de publicación de upstream (Homebrew, Scoop,
  winget, Snap y Chocolatey); las builds se publican como archivos adjuntos
  del release de GitHub.
- Nuevo icono de la app (el NR/XD de DexNR con su mascota) en la app, los
  binarios, los paquetes de Linux y la web.

## [1.1.0] — 2026-09-27

### Añadido
- Instalación con gestores de paquetes: Homebrew
  (`brew install --cask fadeltd/tap/xiaomi-debloater`), winget, Scoop o Snap
  (como `android-debloater`). Todos instalan adb también.
- Paquetes `.deb` y `.rpm` para Linux, con entrada de escritorio e icono.
- Los releases se construyen y publican con GitHub Actions desde este
  changelog.

### Cambiado
- El identificador de bundle de macOS ahora es
  `io.github.fadeltd.xiaomi-debloater` en lugar del predeterminado de Wails,
  `com.wails.xiaomi-debloater`.

## [1.0.0] — 2026-09-27

### Añadido
- Primera release para Windows, macOS y Linux.
- Más de 640 paquetes de MIUI y HyperOS con descripciones y calificación de
  riesgo: seguro, precaución o peligroso.
- Actualizaciones de la lista de paquetes descargadas desde este repositorio
  sin reinstalar la app.
- Deshabilitar, desinstalar, habilitar y restaurar app por app, o eliminar
  muchas a la vez.
- Pestaña Eliminadas con un botón de restaurar para cada app desinstalada
  para el usuario 0.
- Filtros por paquetes Bloatware, OEM, Sistema, Usuario y Deshabilitados, y
  búsqueda.
- Guía integrada para debloatear MIUI y HyperOS con seguridad.
- Detección del modelo del dispositivo, la versión de MIUI u HyperOS y la
  versión de Android.
- Registro de operaciones de cada acción.
