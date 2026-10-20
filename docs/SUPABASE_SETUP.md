# Preparación de Supabase

Esta fase prepara el esquema y el cliente reutilizable para **Ay! Mariachi Para Todos**. No activa WhatsApp, pagos, una consola administrativa ni reemplaza las pantallas de ejemplo existentes.

## 1. Crear y configurar el proyecto

1. Crea un proyecto de Supabase con una contraseña de base de datos guardada fuera del repositorio.
2. En **Authentication > Providers**, habilita los proveedores que se vayan a usar. Para la primera prueba, Email es suficiente. Configura las URL de redirección de la aplicación cuando se integre el inicio de sesión real.
3. En **Connect** o **Settings > API Keys**, copia:
   - Project URL.
   - **Publishable key**. En proyectos antiguos que todavía no ofrecen una clave publicable, usa su clave `anon` heredada.
4. Copia `.env.example` a `.env` y completa sólo esas dos variables:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
   ```

   Para proyectos antiguos, elimina o deja vacía la variable publicable y define `EXPO_PUBLIC_SUPABASE_ANON_KEY`. La aplicación da prioridad a la clave publicable.

`EXPO_PUBLIC_*` se incorpora al cliente de Expo. Por ello, estas variables sólo pueden contener la URL y la clave publicable/anon. **Nunca** agregues `service_role`, contraseñas de base de datos, tokens de WhatsApp/Meta ni secretos administrativos a `.env`, `app.json` o código bajo `src/`.

El archivo `.env` y cualquier `.env.*` están ignorados por Git; `.env.example` queda rastreado como plantilla.

## 2. Dependencias de la aplicación

El módulo `src/lib/supabase.ts` sigue el patrón de Expo de Supabase: usa `@supabase/supabase-js`, `react-native-url-polyfill` y el almacenamiento local de `expo-sqlite` para persistir la sesión.

Instala las versiones compatibles con el SDK Expo del proyecto desde la raíz, después de disponer de acceso al registro npm:

```bash
npx expo install @supabase/supabase-js react-native-url-polyfill expo-sqlite
```

Después, ejecuta `npm install` si el gestor solicita actualizar el árbol local. No sustituyas este comando por la instalación de una clave de servidor ni incluyas paquetes de WhatsApp en esta fase.

> En el entorno automatizado que preparó este cambio, este comando devolvió `403 Forbidden` al consultar el registro npm. Por eso `package.json` y `package-lock.json` no se alteraron artificialmente: hay que ejecutar el comando anterior en un entorno con acceso autorizado antes de importar `src/lib/supabase.ts` desde una pantalla.

## 3. Aplicar la migración

La migración inicial está en:

```text
supabase/migrations/20261020220000_initial_booking_schema.sql
```

Es aditiva y crea perfiles, grupos, membresías privadas, solicitudes, historial y calificaciones. No borra ni modifica datos existentes.

### Opción A: Supabase CLI

1. Instala/configura la [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) fuera de la aplicación según la política del equipo.
2. Inicia sesión y vincula el proyecto correcto:

   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   supabase db push
   ```

3. Revisa el resultado en **Database > Tables** y **Database > Policies**.

### Opción B: SQL Editor

Para un proyecto remoto ya creado, revisa el SQL completo y ejecútalo una sola vez en **SQL Editor**. Registra que se aplicó la versión `20261020220000`; no lo ejecutes de nuevo manualmente si la CLI ya la registró.

Antes de producción, ejecuta pruebas de RLS contra un entorno no productivo con `supabase test db` o pruebas equivalentes de roles cliente, integrante de mariachi y administrador.

## 4. Esquema y flujo de estados

### Tablas

- `profiles`: un perfil por usuario de `auth.users`, con nombre, teléfono y rol controlado (`customer`, `admin`, `mariachi_team`). Un trigger crea el perfil con rol `customer` al registrarse un usuario.
- `mariachi_groups`: información pública de catálogo: nombre comercial, descripción y estado activo.
- `mariachi_group_members`: relación privada entre perfil y grupo; prepara el acceso de integrantes de mariachis.
- `booking_requests`: la fuente persistente de cada solicitud. `whatsapp_reference` es sólo una referencia futura no secreta; no guarda tokens ni mensajes. Los campos de conversación y confirmación administrativa preparan la siguiente fase sin depender de WhatsApp.
- `booking_status_history`: registro append-only generado automáticamente al crear o cambiar estado.
- `ratings`: una calificación por solicitud, garantizada por `unique (booking_request_id)`.

### Estados permitidos

| Estado de origen | Transiciones permitidas |
| --- | --- |
| `pending` | `accepted`, `rejected`, `cancelled` |
| `accepted` | `completed`, `cancelled` |
| `rejected` | Ninguna |
| `cancelled` | Ninguna |
| `completed` | Ninguna |

La base valida estas transiciones mediante trigger. Las transiciones administrativas no tienen permisos `UPDATE` para el cliente móvil: una Edge Function o backend futuro, autenticado como servidor y con autorización explícita, deberá validar al administrador y actualizar el estado. Cuando se conecte WhatsApp, el servidor podrá establecer `whatsapp_reference` y `whatsapp_conversation_started_at`; la aceptación seguirá siendo una decisión persistida en `booking_requests`, no un dato inferido de un mensaje.

Una calificación sólo puede insertarse por el mismo cliente de una solicitud `completed`; el trigger comprueba propiedad y estado antes de insertar.

## 5. Políticas de seguridad

Todas las tablas de `public` de esta migración tienen RLS habilitado y grants explícitos:

- Un usuario autenticado lee y actualiza únicamente su propio perfil. Un trigger impide cambiar su propio rol.
- Los grupos activos son legibles públicamente; no se expone la tabla de membresías como catálogo ni se otorgan escrituras de grupos al cliente.
- Un cliente lee sus propias solicitudes e historial y sólo inserta los campos de una solicitud propia con fecha futura. El estado y los campos de WhatsApp/confirmación quedan en valores controlados por el servidor.
- Integrantes de un grupo pueden leer solicitudes e historial de su grupo mediante helpers privados de RLS.
- No existe permiso directo desde la app para actualizar solicitudes, insertar historial, editar grupos o modificar calificaciones.
- Un cliente puede ver sus calificaciones e insertar una sola calificación para su propia contratación completada. Integrantes del grupo pueden consultar calificaciones asociadas a su grupo.

Las funciones auxiliares usadas por RLS se alojan en el esquema no expuesto `private`, tienen `search_path` fijado y se revoca ejecución pública. No añadas una política amplia como `using (true)` para usuarios autenticados.

## 6. Asignar el primer administrador de forma segura

1. Registra primero la cuenta del administrador mediante Supabase Auth. El trigger creará su perfil con rol `customer`.
2. Comprueba visualmente el UUID del usuario en **Authentication > Users**.
3. Desde el SQL Editor de Supabase, usando una sesión de propietario/proyecto y verificando dos veces el UUID, ejecuta:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = '<UUID_DEL_ADMIN>';
   ```

4. Verifica el resultado con una consulta acotada al mismo UUID y conserva evidencia operativa de quién recibió el privilegio.

No asignes roles a través de `raw_user_meta_data`, de un formulario móvil ni de una política RLS del cliente. En una fase posterior, la Edge Function administrativa deberá comprobar el rol desde una fuente de confianza antes de aceptar/rechazar solicitudes.

## 7. Pendiente para la siguiente fase

- Instalar las tres dependencias indicadas cuando el registro npm esté accesible.
- Conectar `login.tsx` a Supabase Auth y añadir provider/guards de sesión sin cambiar la identidad visual.
- Crear servicios tipados para catálogo, creación y consulta de solicitudes.
- Reemplazar de forma gradual los datos de ejemplo de mariachis/eventos, no todos a la vez.
- Crear una operación server-side/Edge Function para decisiones administrativas, con auditoría del actor.
- Implementar disponibilidad real y prevención de traslapes antes de aceptar una contratación.
- Añadir pruebas RLS y de transiciones de estado.
- Integrar WhatsApp, pagos y consola administrativa solamente después de que el flujo de solicitudes persistentes esté validado.
