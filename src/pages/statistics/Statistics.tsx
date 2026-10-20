import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { usePatientRecords } from "@/hooks/queries";
import { ageOn } from "@/lib/derive";
import { SEX_LABEL } from "@/lib/labels";

const monthFmt = new Intl.DateTimeFormat("es-UY", { month: "short", year: "2-digit" });

const tick = { fontSize: 12, fill: "var(--muted-foreground)" };
const tooltipStyle = { borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 };

export default function Statistics() {
  const { data: patients = [], isPending } = usePatientRecords();
  if (isPending) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: monthFmt.format(d) };
  });
  const thisMonth = months[11]!.key;

  const activePatients = patients.filter((p) => p.status === "activo").length;
  const waitingPatients = patients.filter((p) => p.status === "en_espera").length;
  const newThisMonth = patients.filter((p) => p.current?.startDate.startsWith(thisMonth)).length;
  const finishedThisMonth = patients.filter((p) => p.endDate?.startsWith(thisMonth)).length;

  // Cumulative patients by month (using requestDate)
  const cumulativeData = months.map(({ key, label }) => ({
    mes: label,
    total: patients.filter((p) => p.requestDate && p.requestDate.slice(0, 7) <= key).length,
  }));

  // Patients by department
  const deptCounts: Record<string, number> = {};
  patients.forEach((p) => {
    if (p.department) deptCounts[p.department] = (deptCounts[p.department] ?? 0) + 1;
  });
  const deptData = Object.entries(deptCounts)
    .map(([dept, count]) => ({ dept, count }))
    .sort((a, b) => b.count - a.count);

  // Sex distribution
  const sexCounts: Record<string, number> = { femenino: 0, masculino: 0, otro: 0, prefiero_no_decir: 0 };
  patients.forEach((p) => {
    const k = p.sex ?? "prefiero_no_decir";
    sexCounts[k] = (sexCounts[k] ?? 0) + 1;
  });
  const sexData = Object.entries(sexCounts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ key, name: SEX_LABEL[key] ?? key, value }));

  const SEX_COLORS: Record<string, string> = {
    femenino: "var(--accent)",
    masculino: "var(--primary)",
    otro: "var(--chart-4)",
    prefiero_no_decir: "var(--input)",
  };

  // Age distribution
  const ageGroups = { "≤18": 0, "19–25": 0, "26–35": 0, "36–50": 0, ">50": 0 };
  patients.forEach((p) => {
    const age = ageOn(p.birthDate);
    if (age <= 18) ageGroups["≤18"]++;
    else if (age <= 25) ageGroups["19–25"]++;
    else if (age <= 35) ageGroups["26–35"]++;
    else if (age <= 50) ageGroups["36–50"]++;
    else ageGroups[">50"]++;
  });
  const ageData = Object.entries(ageGroups).map(([grupo, cantidad]) => ({ grupo, cantidad }));

  const card = "bg-card rounded-xl border border-border p-5 min-w-0 overflow-hidden";

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="bg-card rounded-xl border border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-muted">
        <div className="p-5">
          <p className="text-sm text-muted-foreground">Pacientes activos</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">{activePatients}</p>
          <p className="text-sm text-muted-foreground">{waitingPatients} en lista de espera</p>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">Asignados este mes</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">{newThisMonth}</p>
          <p className="text-sm text-muted-foreground">Con profesional asignado</p>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">Finalizaron este mes</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">{finishedThisMonth}</p>
          <p className="text-sm text-muted-foreground">Completaron el proceso</p>
        </div>
      </div>

      {/* Cumulative patients by month */}
      <div className={card}>
        <h2 className="font-semibold text-foreground">Pacientes acumulados por mes</h2>
        <p className="text-sm text-muted-foreground mb-4">Solicitudes acumuladas en los últimos 12 meses</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" vertical={false} />
            <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ fill: "var(--primary)", r: 4 }}
              name="Total pacientes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Age + sex */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h2 className="font-semibold text-foreground">Distribución por rango etario</h2>
          <p className="text-sm text-muted-foreground mb-4">Pacientes según su edad</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ageData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" vertical={false} />
              <XAxis dataKey="grupo" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="cantidad" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Pacientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={card}>
          <h2 className="font-semibold text-foreground">Distribución por sexo</h2>
          <p className="text-sm text-muted-foreground mb-4">Pacientes según el sexo declarado</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sexData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {sexData.map((entry) => (
                  <Cell key={entry.key} fill={SEX_COLORS[entry.key] ?? "var(--chart-4)"} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>
                    {v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patients by department */}
      <div className={card}>
        <h2 className="font-semibold text-foreground">Pacientes por departamento</h2>
        <p className="text-sm text-muted-foreground mb-4">Cantidad de pacientes según su departamento</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptData} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" horizontal={false} />
            <XAxis type="number" tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="dept" tick={tick} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Pacientes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
