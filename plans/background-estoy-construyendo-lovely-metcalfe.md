# Plan: UI Improvements — Peluffo Giguens App

## Context

The mental health patient management app needs several UI improvements: fixing responsive layout issues on mobile statistics, unifying the Patients and Statistics tabs across roles, removing the Asignación tab, updating branding, and improving the Psychologists list to a table layout on desktop. The home/login page also needs a visual refresh replacing text bullets with an image.

---

## Changes

### 1. Brand rename: "SaludMental UY" → "Peluffo Giguens"

**Files:**
- `src/app/components/Layout.tsx` line 114 (ColibriLayout header `<span>`)
- `src/app/components/Layout.tsx` line 162 (main sidebar `<div className="text-white font-semibold...">`)
- `src/app/components/Login.tsx` line 101 (mobile form header `<span>`)

Replace all occurrences of `"SaludMental UY"` with `"Peluffo Giguens"`.

---

### 2. Login page: Replace text bullets with a full-height image

**File:** `src/app/components/Login.tsx`

In the left panel (lines 56–86), remove:
- `<h1>Conectando pacientes…</h1>`
- `<p>Plataforma de gestión…</p>`
- The three bullet-point feature items (`<div className="space-y-4">…</div>`)

Replace with a full-height image that fills the left panel. Use an Unsplash mental health / calm nature image:
```
https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80
```
(serene nature/calm, fitting for mental health context)

The left panel should become a full-bleed image container:
```tsx
<div className="hidden lg:block relative w-1/2 overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80"
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* overlay + logo */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex flex-col p-12">
    <div className="flex items-center gap-3">
      {/* logo icon */}
      <span className="text-xl font-semibold text-white tracking-tight">Peluffo Giguens</span>
    </div>
  </div>
</div>
```

The background gradient on the `<div className="min-h-screen flex">` wrapper stays for the right panel only (move it to the right panel background, or keep it and let the image overlay cover the left).

---

### 3. Remove "Asignación" tab

**`src/app/components/Layout.tsx`:**
Remove the entire nav item object for `"asignacion"` (lines 56–64):
```ts
{ id: "asignacion", label: "Asignación", roles: ["fibras"], icon: … }
```

**`src/app/App.tsx`:**
- Remove `import { Assignment } from "./components/Assignment";`
- Remove the `case "asignacion": return <Assignment />;` block from the switch

---

### 4. Unify Patients tab (use Peluffo layout for all roles)

**File:** `src/app/components/Patients.tsx`

Currently:
```ts
const useLastFirst = userRole === "peluffo" || userRole === "colibri";
const maskNames = userRole === "peluffo";
```

Change to:
```ts
const useLastFirst = true; // uniform sorted display for all roles
const maskNames = userRole === "peluffo";
```

This makes Fibras see patients sorted last-name-first (same layout as Peluffo demo) but still sees full names. Only Peluffo masks names to initials.

---

### 5. Unify Statistics tab (use StatisticsPeluffo for all roles)

**`src/app/App.tsx`:**

Change:
```tsx
case "estadisticas":
  return user.role === "peluffo"
    ? <StatisticsPeluffo />
    : <StatisticsFibras />;
```
To:
```tsx
case "estadisticas":
  return <StatisticsPeluffo />;
```

Remove the `import { StatisticsFibras }` line.

---

### 6. Fix StatisticsPeluffo mobile responsive

**File:** `src/app/components/StatisticsPeluffo.tsx`

Issues:
- The 3-chart row (`grid lg:grid-cols-3`) stacks to 1 column on mobile, which is correct, but recharts containers inside can overflow in grid/flex contexts.
- The horizontal bar chart YAxis (90px wide) can cause layout issues on narrow screens.

Fixes:
1. Add `min-w-0 overflow-hidden` to **every** chart card `<div className="bg-white rounded-xl border p-5">`.
2. For the "Pacientes por departamento" section, wrap the `<ResponsiveContainer>` in `<div className="overflow-x-auto -mx-1 px-1">` to allow horizontal scroll on very small screens.
3. Change the 3-chart grid from `grid lg:grid-cols-3` to `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Since there are 3 items, the 3rd will span full on sm (one on each row would look odd), so consider using `lg:grid-cols-3` only (1→3) with responsive heights for the charts on small screens (`height={160}` on mobile via a fixed value with media query or just reducing from 200 to 180).
4. Reduce `ResponsiveContainer height` on the three bottom charts from `200` to `180` to avoid vertical clipping on mobile.

---

### 7. Psychologists: Desktop table view

**File:** `src/app/components/Psychologists.tsx`

Replace the card-only grid (`<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">`) with a responsive layout:

- **Mobile (< md):** keep the current cards (`<div className="md:hidden grid gap-4">`)
- **Desktop (≥ md):** show a table (`<div className="hidden md:block">`)

Table structure:
| Nombre | Especialidades | Modalidad | Exp. | Pacientes | Estado | Acciones* |
|---|---|---|---|---|---|---|

*Acciones column (Editar / Eliminar) only when `canABM`.

Table rows are clickable (same `onClick={() => setSelected(psyc)}` as before). The Acciones column on fibras shows an Edit button that calls `setEditTarget(psyc)` directly, and a Delete button that calls `setDeleteConfirm(psyc.id)`.

Style the table matching the Patients table style:
- White card with `rounded-xl border overflow-hidden` wrapper
- `overflow-x-auto` inner div
- Header row: `text-xs font-semibold uppercase tracking-wider` in muted green
- Rows: `hover:bg-[#f9fbfa]` cursor-pointer
- Especialidades shown as inline tags (same pill style as cards)
- Status shown as `<Badge>`
- Stars component in each row for rating

---

## Verification

After implementation:
1. Log in as "Colaborador Peluffo" (quick access) → Estadísticas tab: charts should be visible and not cut on mobile viewport (375px wide)
2. Log in as "fibras/fibras" → Pacientes tab should have last-name-first sorting (same as Peluffo demo); Estadísticas should show StatisticsPeluffo (donut + bar charts, not the hardcoded StatisticsFibras)
3. Check that "Asignación" does not appear in the Fibras sidebar
4. Sidebar shows "Peluffo Giguens" in all three layouts (main, Colibrí, mobile login)
5. Login page left panel shows image instead of text bullets
6. Psychologists tab on desktop (≥ 768px) shows a table; on mobile shows cards
