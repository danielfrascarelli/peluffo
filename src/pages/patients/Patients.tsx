import { useState } from "react";
import Avatar from "@/components/shared/Avatar";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import ListItem from "@/components/shared/ListItem";
import Modal from "@/components/shared/Modal";
import ModalHeader from "@/components/shared/ModalHeader";
import PersonDetail from "@/components/patients/PersonDetail";
import SearchInput from "@/components/shared/SearchInput";
import { usePatientRecords, usePsychologists } from "@/hooks/queries";
import { formatDate } from "@/lib/format";
import { PATIENT_STATUS, REQUEST_FOR_LABEL } from "@/lib/labels";
import { byLastName, initials, lastFirst } from "@/lib/names";
import type { PatientRecord } from "@/lib/derive";
import { cn } from "@/lib/utils";

type StatusFilter = "todos" | PatientRecord["status"];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: PATIENT_STATUS.activo.label },
  { value: "en_espera", label: PATIENT_STATUS.en_espera.label },
  { value: "finalizado", label: PATIENT_STATUS.finalizado.label },
];

// Active patients show their professional; discharged ones keep the one who discharged them.
const lastProfessionalId = (p: PatientRecord): string | null =>
  p.current?.psychologistId ?? (p.status === "finalizado" ? (p.history.at(-1)?.psychologistId ?? null) : null);

export default function Patients(): React.JSX.Element {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: patients = [], isPending: patientsPending } = usePatientRecords();
  const { data: psychologists = [], isPending: psychsPending } = usePsychologists();

  if (patientsPending || psychsPending) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const psycMap = Object.fromEntries(psychologists.map((p) => [p.id, lastFirst(p)]));
  const psychNameOf = (id: string | null) => (id ? psycMap[id] : undefined);

  const q = search.toLowerCase();

  const filtered = patients
    .filter((p) => status === "todos" || p.status === status)
    .filter((p) => initials(p).toLowerCase().includes(q) || (p.cedula ?? "").includes(q))
    .sort(byLastName);

  const selected = patients.find((p) => p.id === selectedId);
  const nameOf = (p: PatientRecord) => initials(p);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por iniciales o cédula..."
          className="sm:max-w-sm w-full"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                status === f.value ? "bg-foreground text-card" : "text-muted-foreground hover:bg-row-hover",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? "paciente" : "pacientes"}
        </p>
      </div>

      {filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-border py-10 text-center text-sm text-muted-foreground">
          {search
            ? `No hay pacientes que coincidan con «${search}». Probá con otro nombre.`
            : "No hay pacientes con ese estado."}
        </div>
      )}

      {filtered.length > 0 && (
        <>
          <ul className="md:hidden bg-card rounded-xl border border-border divide-y divide-muted overflow-hidden">
            {filtered.map((p) => {
              const psychName = psychNameOf(lastProfessionalId(p));
              return (
                <li key={p.id}>
                  <ListItem
                    leading={<Avatar name={nameOf(p)} initial={p.lastName.charAt(0)} size="sm" />}
                    title={nameOf(p)}
                    subtitle={[psychName ?? "Sin asignar", p.department].filter(Boolean).join(" · ")}
                    trailing={<Badge label={PATIENT_STATUS[p.status].label} tone={PATIENT_STATUS[p.status].tone} />}
                    onClick={() => setSelectedId(p.id)}
                  />
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {[
                    "Nombre",
                    "Para quién",
                    "Fecha de solicitud",
                    "Profesional a cargo",
                    "Fecha de asignación",
                    "Fin de tratamiento",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-muted-foreground bg-background/60"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 bg-background/60"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const psychName = psychNameOf(lastProfessionalId(p));
                  return (
                    <tr
                      key={p.id}
                      className="cursor-pointer transition-colors border-t border-muted hover:bg-row-hover"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedId(p.id)}
                      onClick={() => setSelectedId(p.id)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={nameOf(p)} initial={p.lastName.charAt(0)} size="xs" />
                          <span className="font-medium whitespace-nowrap text-foreground">{nameOf(p)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                        {p.requestFor ? REQUEST_FOR_LABEL[p.requestFor] : "—"}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                        {formatDate(p.requestDate)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3.5 whitespace-nowrap",
                          psychName ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {psychName ?? "Sin asignar"}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                        {formatDate(p.current?.startDate)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{formatDate(p.endDate)}</td>
                      <td className="px-4 py-3.5">
                        <Button variant="secondary" className="text-xs px-3 py-1.5">
                          Ver
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected && (
        <Modal onClose={() => setSelectedId(null)} maxWidth="sm:max-w-2xl" label="Detalle del paciente">
          <ModalHeader onClose={() => setSelectedId(null)} sticky>
            <div className="flex items-center gap-2">
              <Badge label={PATIENT_STATUS[selected.status].label} tone={PATIENT_STATUS[selected.status].tone} />
            </div>
          </ModalHeader>
          <PersonDetail
            patient={selected}
            psychologistName={psychNameOf(selected.current?.psychologistId ?? null)}
            nameOfPsychologist={(id) => psychNameOf(id) ?? "Profesional dado de baja"}
          />
        </Modal>
      )}
    </div>
  );
}
