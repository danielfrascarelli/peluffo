# Plan: Tres roles de colaborador diferenciados + rediseño de estadísticas

## Context
El sistema tenía un único rol "coordinador" genérico. Se reemplaza por tres roles con permisos y UX específicos: **Peluffo** (gestión de pacientes/candidatos), **Colibri** (asignaciones, UI mínima), y **Fibras** (acceso total + ABM de psicólogos). Los accesos demo del login se simplifican a solo Peluffo y Colibri. También se eliminan datos que no son responsabilidad de la plataforma (sesiones, próxima sesión).

---

## Nuevos roles (`UserRole`)

```ts
type UserRole = "peluffo" | "colibri" | "fibras" | "psicologo" | "paciente";
```

### Usuarios mock nuevos
| username | password | role | nombre |
|---|---|---|---|
| colaborador.peluffo | pass123 | peluffo | Carolina Anastasiadis |
| colaborador.colibri | pass123 | colibri | Carolina Brussoni |
| colaborador.fibras | pass123 | fibras | Laura Fibras |

Los usuarios anteriores `coordinadora` y `admin2` se actualizan a `fibras`.

---

## Menús por rol

| Sección | peluffo | colibri | fibras | psicologo | paciente |
|---|---|---|---|---|---|
| Candidatos | ✓ | — | ✓ | — | — |
| Pacientes | ✓ | — | ✓ | ✓ (solo propios) | — |
| Psicólogos | — | — | ✓ (con ABM) | — | — |
| Asignación (Fibras) | — | — | ✓ | — | — |
| Asignación Colibri | — | ✓ | — | — | — |
| Estadísticas | ✓ (Peluffo) | — | ✓ (completa) | — | — |
| Mis agendas | — | — | — | ✓ | — |
| Mi perfil | — | — | — | — | ✓ |

---

## Datos a eliminar de `Patient`

Quitar: `sessionsCompleted`, `nextSession`. No son gestionados por la plataforma. Actualizar `Patients.tsx` para no mostrar esas columnas.

Agregar a `Patient`: `department` y `startDate` ya existen; agregar `endDate?: string` (fecha de finalización, para estadísticas de "finalizaron este mes").

---

## Estadísticas Peluffo (`StatisticsPeluffo.tsx`)

### Mantener
- KPI: Pacientes activos
- KPI: Candidatos pendientes
- Gráfico: Tiempo de espera promedio (línea semanal)

### Agregar (requeridos por usuario)
- KPI: Nuevos pacientes este mes
- KPI: Pacientes que finalizaron este mes
- Gráfico: Pacientes por departamento (barras horizontales)

### Sugerencias adicionales (incluir)
- KPI: Tasa de conversión candidatos → pacientes (% aprobados del total)
- Gráfico: Distribución por rango etario (<25 / 25-40 / 41-60 / >60) — útil para entender el perfil de la población atendida

### Eliminar
- Sesiones por mes
- Estado de pacientes (donut)
- Modalidad de sesiones
- Rendimiento por psicólogo

---

## Estadísticas Fibras (`Statistics.tsx` actual, renombrado a `StatisticsFibras.tsx`)

Mantiene todo lo actual más lo nuevo de Peluffo.

---

## UI Colibri (`ColibriAssignment.tsx`)

Tabla minimalista:
```
| Psicólogo | Pacientes asignados | Acción |
|---|---|---|
| Dr. Rodríguez | Martín G., Elena C. | Editar asignación |
```
- Botón "Editar" abre un modal simple: lista de pacientes sin asignar, checkbox para seleccionar/deseleccionar
- Sin sidebar colorido ni datos extra — layout sin sidebar, solo header blanco + tabla
- No hay ABM de psicólogos en Colibri

---

## ABM Psicólogos para Fibras

Agregar en `Psychologists.tsx` (solo visible para role `fibras`): botón "Agregar psicólogo" + botón "Editar" y "Eliminar" en cada tarjeta. Modal de formulario con todos los campos del interface `Psychologist`.

---

## Login — accesos demo

Solo mostrar:
- Colaborador Peluffo → `colaborador.peluffo`
- Colaborador Colibri → `colaborador.colibri`

Psicólogo, paciente y fibras se logean con usuario/contraseña manualmente.

---

## Archivos a modificar / crear

| Archivo | Cambio |
|---|---|
| `mock-data.ts` | Nuevos roles, nuevos usuarios, quitar sessionsCompleted/nextSession de Patient, agregar endDate |
| `Login.tsx` | Solo 2 accesos demo |
| `Layout.tsx` | NAV_ITEMS actualizado con los 3 nuevos roles; layout simplificado para Colibri (sin sidebar verde, solo header) |
| `App.tsx` | Routing para los 3 nuevos roles |
| `Statistics.tsx` → `StatisticsFibras.tsx` | Renombrar, mantener todo |
| `StatisticsPeluffo.tsx` (nuevo) | Solo las stats de Peluffo |
| `Patients.tsx` | Quitar columnas sessionsCompleted y nextSession |
| `Psychologists.tsx` | Agregar ABM (solo si role === "fibras") |
| `ColibriAssignment.tsx` (nuevo) | Tabla simple psicólogo → pacientes + modal editar asignación |
| `Assignment.tsx` | Renombrar como "Asignación Fibras", sin cambios funcionales |

---

## Verificación

1. Login con `colaborador.peluffo` → ve Candidatos, Pacientes, Estadísticas (Peluffo). NO ve Psicólogos ni Asignación.
2. Login con `colaborador.colibri` → ve solo la tabla simple de asignación. UI sin sidebar verde.
3. Login con `colaborador.fibras` → ve todo, incluyendo botones Agregar/Editar/Eliminar en Psicólogos.
4. Login con `dr.rodriguez` → ve Pacientes propios y Agendas. Pacientes no muestra columnas de sesiones.
5. Estadísticas Peluffo no muestra "Sesiones por mes" ni "Rendimiento por psicólogo".
6. Gráfico "Pacientes por departamento" muestra datos del array PATIENTS.

---

# Plan: Wizard público de registro de candidatos

## Context
El formulario actual de Google Forms tiene un orden poco natural y una UX básica. Se quiere reemplazar con un wizard propio dentro de la plataforma, accesible sin login, que guíe al usuario paso a paso, sea amigable para rangos de edad amplios (20–60+ años) y al finalizar registre al usuario como un nuevo Candidato visible en el panel de coordinadores.

## Campos relevados del Google Form (reordenados y extendidos)
1. Nombre y Apellido
2. Fecha de nacimiento *(reemplaza "edad")*
3. Cédula de Identidad (sin puntos ni guiones)
4. Correo electrónico
5. Teléfono
6. Ciudad + **Departamento** *(nuevo)*
7. Motivo de consulta (textarea grande, copia cálida)
8. Modalidad preferida (presencial / online / ambas) *(existente en Candidate)*
9. Horario preferido *(existente en Candidate)*
10. Mutualista / Plan de salud *(opcional, existente)*
11. ¿Te gustaría continuar el proceso con arancel social? (Sí / No / Lo decidiré después)
12. ¿Cómo llegaste a la Peluffo? *(nuevo)*
    - Redes sociales (Instagram, Facebook, etc.)
    - Me lo recomendó un amigo o familiar
    - Lo vi en un evento o charla
    - Por la radio
    - Por Google / internet
    - A través de mi médico u otro profesional
    - Otro
13. ¿Tuviste tratamiento psicológico anteriormente? (Sí / No) *(nuevo — clínicamente relevante)*
14. ¿Estás tomando medicación actualmente? (Sí / No / Prefiero no decir) *(nuevo — relevante para el psicólogo)*
15. ¿Hay alguna situación de urgencia o crisis que debamos saber? (Sí / No) *(nuevo — triage básico de seguridad)*
16. ✉️ ¿Querés que te contactemos para contarte de novedades y beneficios de la Peluffo? (checkbox opt-in) *(nuevo)*

## Estructura del wizard: 5 pasos

| Paso | Título | Campos |
|------|--------|--------|
| 1 | ¿Quién sos? | Nombre y Apellido, Fecha de nacimiento, Cédula de Identidad |
| 2 | ¿Cómo te contactamos? | Email, Teléfono, Dirección, Ciudad, Departamento (select con 19 dptos UY) |
| 3 | Contanos sobre vos | Motivo de consulta (textarea grande, copy empático), ¿Tuviste tratamiento previo? (Sí/No), ¿Estás tomando medicación? (Sí/No/Prefiero no decir), ¿Situación de urgencia o crisis? (Sí/No) |
| 4 | Tus preferencias | Modalidad, Horario preferido, Mutualista (opcional), ¿Continuar con arancel social? |
| 5 | Una última pregunta + Confirmación | ¿Cómo llegaste a la Peluffo? (tarjetas), opt-in novedades (checkbox), resumen de datos, botón Enviar |

Pantalla final: pantalla de éxito ("¡Gracias! Tu solicitud fue registrada") con botón "Volver al inicio".

## UX / Diseño
- **Barra de progreso** visible siempre arriba (5 pasos = 20% / 40% / 60% / 80% / 100%)
- **Una sección por paso** — no scroll largo, foco en lo que se pide
- **Tipografía grande** (mínimo 16px base ya configurado) y botones con buena área táctil (py-3+)
- **Copy cálido y en vos uruguayo** ("Contanos", "¿Dónde vivís?")
- **Botones Siguiente / Atrás** claros — nunca ocultar Atrás
- **Validación en el paso**, no al final — mensajes de error inline, simples
- **Selects de Departamento** con los 19 departamentos de Uruguay
- Para opciones de "¿Cómo llegaste?" usar **tarjetas clickeables** (fácil en mobile y desktop, sin radio button pequeño)
- Para modalidad y arancel también usar **tarjetas / botones grandes**

## Archivos a modificar / crear

### Nuevo: `src/app/components/RegistrationWizard.tsx`
Componente principal del wizard. Maneja estado local con los 5 pasos. Al enviar, llama `onRegister(candidate)` que el padre agrega a la lista de candidatos mock.

### Modificar: `src/app/mock-data.ts`
Extender interfaz `Candidate` con:
```ts
birthDate: string;        // "YYYY-MM-DD"
cedula: string;
city: string;
department: string;
address: string;
continueWithFee: "si" | "no" | "decidire";
howDidYouHear: string;
previousTreatment: "si" | "no";
currentMedication: "si" | "no" | "prefiero_no_decir";
urgencySituation: "si" | "no";
newsletterOptIn: boolean;
```
Agregar función `addCandidate(c: Candidate)` o manejar con estado externo.

### Modificar: `src/app/App.tsx`
- Agregar estado `showWizard: boolean`
- Si `!user && !showWizard` → `<Login onRegister={() => setShowWizard(true)} />`
- Si `showWizard` → `<RegistrationWizard onFinish={() => setShowWizard(false)} onAddCandidate={...} />`

### Modificar: `src/app/components/Login.tsx`
Agregar link/botón debajo del formulario: **"¿Querés ser paciente? Registrate aquí →"** que llama `onRegister()`.

### Modificar: `src/app/components/Candidates.tsx`
Mostrar los campos nuevos (birthDate, cedula, city, department, etc.) en el modal de detalle.

## Estado mock de candidatos
Como no hay backend, se usa un `useState` en `App.tsx` para la lista de candidatos, inicializada con `CANDIDATES`. El wizard recibe `onAddCandidate` como prop y agrega el nuevo candidato. `Candidates.tsx` recibe `candidates` como prop en vez de importar directo el array.

## Verificación
1. Desde la pantalla de login, click en "Registrate aquí" → abre el wizard sin login
2. Completar los 5 pasos → pantalla de éxito
3. Loguearse como `coordinadora` → en "Candidatos" aparece el nuevo registro con estado "pendiente"
4. En el modal de detalle del candidato aparecen todos los campos nuevos
5. Los botones Atrás/Siguiente funcionan y la barra de progreso avanza
6. Validaciones: campos obligatorios bloquean el avance con mensaje inline
