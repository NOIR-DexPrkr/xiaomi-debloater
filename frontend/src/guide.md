# Guía de debloat para Xiaomi / HyperOS

## Antes de empezar

- **Activa las opciones de desarrollador.** Ve a Ajustes > Acerca del teléfono y toca *Versión de MIUI* (en HyperOS se llama *Versión del OS*) unas 7 veces, hasta que el teléfono diga que ya eres desarrollador. [2][5][8]
- **Activa la depuración por USB.** Ve a Ajustes > Ajustes adicionales > Opciones de desarrollador y activa *Depuración por USB*. Activa también *Depuración por USB (ajustes de seguridad)*, que requiere iniciar sesión con una cuenta Mi. Cuando conectes el teléfono por primera vez, toca Permitir en el aviso RSA. [2][5]
- **Haz una copia de seguridad antes.** La guía de Reddit sugiere una copia local en Ajustes > Acerca del teléfono > Copia de seguridad y restauración > Dispositivo móvil, y luego copiar la carpeta `MIUI/backup/AllBackup` a tu PC junto con DCIM, Downloads y Documents. [1] Una eliminación mala puede dejar el teléfono en bucle de arranque, y la única solución puede ser un restablecimiento de fábrica que borra tus datos. [2]
- **Desinstalar frente a deshabilitar:**
  - `pm uninstall -k --user 0 <pkg>` elimina la app solo para tu usuario. El APK permanece en la partición del sistema y `-k` conserva sus datos, así que puedes deshacerlo. [8]
  - `pm disable-user --user 0 <pkg>` congela la app y la deja instalada. [8] En HyperOS reciente (Android 14+), Xiaomi bloquea la congelación de apps del sistema con una `SecurityException`, así que la herramienta de ovsky usa la desinstalación para el usuario 0 en su lugar. [5]
- **Deshacer:** `adb shell cmd package install-existing <pkg>` devuelve un paquete eliminado. [3] `pm install-existing --user 0 <pkg>` hace lo mismo. [8]
- **Reinicia después de cada lote.** Si el teléfono arranca con normalidad, probablemente no rompiste nada esencial. [3]
- **Investiga lo que no tengas claro.** Elimina los paquetes de uno en uno y averigua primero qué hace cada uno. [6]

## Orden recomendado

1. **Primero anuncios y telemetría.** Ejemplos: `com.miui.msa.global`, `com.miui.analytics`, `com.miui.systemAdSolution`, `com.miui.daemon`, `com.xiaomi.security.onetrack`, y los stubs de Facebook (`com.facebook.appmanager/services/system`). La "fase 1" de ovsky y todas las listas coinciden en estos. [5][6][8]
2. **Después las precargas de terceros.** Juegos, apps de compras, stubs de Netflix/Spotify y apps de operadores (Orange, Vodafone, Telekom, O2). Todos estos están marcados como Recomendados en UAD-ng. [4][7]
3. **Al final las apps opcionales de Xiaomi, y solo si ya instalaste reemplazos.** Ejemplos: Galería, Clima, Notas, Música, Calendario, Administrador de archivos, Navegador. ovsky llama a esta fase "Caution" (precaución). [5]
4. Trata el grupo "Risky" de ovsky (Security Center, Find Device, GetApps, Mi Account, Themes, Mi Cloud) y las entradas Expert/Unsafe de UAD-ng como "no quitar a menos que estés seguro". ovsky omite la fase de riesgo por defecto. [4][5]

mpierson ofrece la misma idea como tres perfiles (seguro, equilibrado, agresivo), y el agresivo es el más probable que rompa funciones. [8]

## Ajustes de privacidad que no necesitan ADB

Todo lo siguiente proviene de la guía de Reddit: [1]
- **DNS privado:** Ajustes > Conexión y uso compartido > DNS privado > `dns.adguard-dns.com` bloquea anuncios en todo el sistema.
- **Revocar permisos del sistema:** Ajustes > Contraseñas y seguridad > Autorización y revocación. Desactiva *msa*, *MIUI Daemon*, *Feedback* y *System apps updater*; este último detiene instalaciones silenciosas como Game Center. Desactiva también *Calendar* para evitar eventos promocionales. Es posible que tengas que tocar Revocar más de una vez.
- **Anuncios:** Ajustes > Contraseñas y seguridad > Privacidad > Servicios de anuncios. Desactiva *Recomendaciones de anuncios personalizados* y el *Programa de experiencia de usuario*.
- **GetApps:** cambiar la región del teléfono a Estados Unidos oculta GetApps.
- **Escaneo:** Ajustes > Ubicación > Servicios de ubicación. Desactiva el escaneo de Wi-Fi y Bluetooth.
- **Pantalla de bloqueo:** Desactiva *Glance for Mi* (Wallpaper Carousel) en Pantalla siempre activa y pantalla de bloqueo.
- **Apps sin conexión:** app Security > Uso de datos > Restringir uso de datos. Bloquea el acceso a la red de las apps que no lo necesiten.

Algunas apps de Xiaomi (Security, Downloads, Files, Themes, Music, GetApps) pueden tener su propio interruptor de "recomendaciones". Ninguna de las fuentes documenta estos interruptores, así que revisa los ajustes de cada app por tu cuenta.

## Nunca elimines

| Paquete | Por qué |
|---|---|
| `com.miui.securitycenter`, `com.miui.securitycore`, `com.miui.securityadd` | Pila de seguridad. UAD-ng reporta bucles de arranque, especialmente antes de MIUI 13. [4] |
| `com.android.updater` | Actualizaciones del sistema. Puede dejar en bucle de arranque MIUI antiguos. [4] |
| `com.miui.home` (o tu launcher de POCO) | Sin él pierdes los gestos y las apps recientes, incluso con otro launcher. [4] |
| `com.lbe.security.miui`, `com.miui.permission` | Administrador de permisos. ovsky los conserva solo para restaurar. [4][5] |
| `com.miui.rom`, `com.miui.system`, `com.miui.core`, `android.miui.overlay` | Framework central de MIUI. [4] |
| `com.miui.global.packageinstaller`, `com.miui.packageinstaller`, `com.android.packageinstaller` | Necesarios para instalar apps. Eliminarlos deja en bucle de arranque Xiaomi.eu y las ROM de China. [4] |
| `com.xiaomi.finddevice`, `com.xiaomi.account` | Cierra tu cuenta Mi primero, o podrías quedar bloqueado. Eliminar Find Device también rompe el restablecimiento de fábrica desde Ajustes. [4] |
| `com.xiaomi.micloud.sdk` | Hace que el teléfono se reinicie solo. [4] |
| `com.android.overlay.circletosearch` | Deja el teléfono inutilizable (soft brick) en HyperOS 2. [4] |
| `com.android.htmlviewer`, `com.google.android.ext.shared` | Se reportaron bucles de arranque en MIUI 12.5–14. [4] |
| `com.miui.systemui.carriers.overlay`, `com.android.phone`, `com.android.providers.telephony` | Llamadas, SIM y LTE. [4] |
| `com.miui.miwallpaper` | Deja la pantalla de bloqueo en negro y rompe "Establecer como fondo de pantalla". [8] |
| `com.android.vpndialogs` | Consérvalo si usas alguna app VPN. [3] |

## Notas de HyperOS

- Algunos paquetes tienen nombres distintos en HyperOS. ovsky lista `com.miui.findmy` (HyperOS) junto a `com.xiaomi.finddevice`, `com.xiaomi.scanner` junto a `com.miui.scanner`, `com.xiaomi.market`/`com.xiaomi.mipicks` para GetApps, y tres nombres para Themes. [5]
- Estos paquetes solo aparecen en HyperOS: `com.xiaomi.hypercomm` (interconexión) y `com.xiaomi.aicr` (motor de IA). [5] En HyperOS 3, la función Camera Ring depende de `com.android.inputsettings.overlay.miui`. [4] Eliminar `miui.systemui.plugin` reemplaza el centro de control y la interfaz de volumen de HyperOS por las versiones de Android estándar. [4]
- Las ROM de China y las globales/EEA incluyen paquetes distintos. En las ROM de EU el marcador predeterminado es el de Google. En un HyperOS 2 EU 15 Ultra, eliminar `com.miui.audiomonitor`, `com.android.calllogbackup`, los overlays de SystemUI/Ajustes de MIUI o el overlay del controlador de permisos hizo dejar de funcionar el botón de grabación de llamadas. [3]
- **Joyose** (`com.xiaomi.joyose`): las fuentes discrepan. Algunos usuarios de XDA dicen que limita el rendimiento en juegos, mientras que otros lo conservan para el control térmico. ovsky te pregunta antes de eliminarlo. [3][5]
- **Desbloqueo del bootloader:** un colaborador de XDA aconseja a los dueños de dispositivos globales que planean desbloquear el bootloader no usar la lista agresiva del 15 Ultra. [3]

## Después de las actualizaciones OTA

- Una desinstalación para el usuario 0 no detiene las actualizaciones OTA. [9] mpierson dice que la OTA puede fallar si eliminas `com.xiaomi.xmsf`, `xmsfkeeper`, `com.miui.cloudservice(.sysbase)`, `com.xiaomi.micloud.sdk`, `com.miui.daemon` o `com.xiaomi.simactivate.service`. Restaura esos paquetes y reinicia si las actualizaciones se detienen. [8]
- Las actualizaciones importantes añaden bloat nuevo. La lista de XDA se revisó para HyperOS 3 por esta razón. [3] Algunos paquetes también reaparecen: `com.xiaomi.ugd` reapareció en HyperOS. [4]
- Después de cada actualización del sistema, abre esta app, pulsa **Actualizar lista** y revisa la pestaña Bloatware por si hay algo nuevo.

## Fuentes

1. Reddit r/miui, "The Ultimate MIUI Debloat & Privacy Guide (No Root)": https://www.reddit.com/r/miui/comments/1sd50rf/the_ultimate_miui_debloat_privacy_guide_no_root/ (read via web.archive.org)
2. kirthandev/MIUI-Debloater-official: https://github.com/kirthandev/MIUI-Debloater-official
3. XDA, "Xiaomi 15 Ultra Global – Debloat List" (pages 1–6): https://xdaforums.com/t/xiaomi-15-ultra-global-debloat-list.4726400/ (read via web.archive.org)
4. UAD-ng uad_lists.json: https://github.com/Universal-Debloater-Alliance/universal-android-debloater-next-generation
5. ovsky/hyperos-debloater: https://github.com/ovsky/hyperos-debloater
6. KernelTruth gist, "XIAOMI MIUI: Ultimate Package Uninstall List 2024": https://gist.github.com/KernelTruth/b85b55154c894ad77c6b62c01bfc4b50
7. Xiaomi_15_Ultra_HyperOS_3_Debloat.txt, the package list attached to the XDA thread [3]
8. matthieu-pierson/debloat-hyperos-adb: https://github.com/matthieu-pierson/debloat-hyperos-adb
9. leechuanfeng/hyperos-debloat: https://github.com/leechuanfeng/hyperos-debloat
