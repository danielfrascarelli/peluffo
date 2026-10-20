import { useState } from "react";
import Avatar from "@/components/shared/Avatar";
import Badge from "@/components/shared/Badge";
import ListItem from "@/components/shared/ListItem";
import Modal from "@/components/shared/Modal";
import ModalHeader from "@/components/shared/ModalHeader";
import SearchInput from "@/components/shared/SearchInput";
import { useAssignments, usePsychologists } from "@/hooks/queries";
import { psychologistLoad } from "@/lib/derive";
import { MODALITY_LABEL, PSYCH_STATUS } from "@/lib/labels";
import { byLastName, fullName, lastFirst } from "@/lib/names";
import { cn } from "@/lib/utils";

function Stars({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className={cn(
            "stroke-chart-5",
            small ? "w-3 h-3" : "w-3.5 h-3.5",
            i <= Math.round(rating) ? "fill-chart-5" : "fill-none",
          )}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs ml-1 text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Psychologists() {
  const { data: psychologists = [], isPending: loadingPsychs } = usePsychologists();
  const { data: assignments = [], isPending: loadingAssignments } = useAssignments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  if (loadingPsychs || loadingAssignments) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const q = search.toLowerCase();
  const filtered = [...psychologists]
    .sort(byLastName)
    .filter((p) => fullName(p).toLowerCase().includes(q) || p.specialties.some((s) => s.toLowerCase().includes(q)));

  const selected = psychologists.find((p) => p.id === selectedId) ?? null;

  const thClass = "text-left px-4 py-3 text-xs font-medium text-muted-foreground bg-background/60";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o especialidad..."
          className="sm:max-w-sm w-full"
        />
        <span className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "profesional" : "profesionales"}
        </span>
      </div>

      {filtered.length === 0 && (
        <p className="bg-card rounded-xl border border-border text-center py-10 text-sm text-muted-foreground">
          {search
            ? `No hay profesionales que coincidan con «${search}». Probá con otro nombre o especialidad.`
            : "Todavía no hay profesionales cargados."}
        </p>
      )}

      {filtered.length > 0 && (
        <ul className="md:hidden bg-card rounded-xl border border-border divide-y divide-muted overflow-hidden">
          {filtered.map((psyc) => {
            const load = psychologistLoad(psyc, assignments);
            const s = PSYCH_STATUS[load.status];
            return (
              <li key={psyc.id}>
                <ListItem
                  leading={<Avatar name={fullName(psyc)} size="sm" initial={psyc.lastName.charAt(0)} />}
                  title={lastFirst(psyc)}
                  subtitle={`${psyc.specialties.slice(0, 2).join(", ")} · ${load.current}/${psyc.maxPatients} pacientes`}
                  trailing={<Badge label={s.label} tone={s.tone} />}
                  onClick={() => setSelectedId(psyc.id)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {filtered.length > 0 && (
        <div className="hidden md:block">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Nombre", "Especialidades", "Modalidad", "Carga", "Estado"].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((psyc) => {
                  const load = psychologistLoad(psyc, assignments);
                  const s = PSYCH_STATUS[load.status];
                  const occupancy = psyc.maxPatients
                    ? Math.min(Math.round((load.current / psyc.maxPatients) * 100), 100)
                    : 0;
                  const name = lastFirst(psyc);
                  return (
                    <tr
                      key={psyc.id}
                      onClick={() => setSelectedId(psyc.id)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedId(psyc.id)}
                      className="border-t border-muted hover:bg-row-hover cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} size="xs" initial={psyc.lastName.charAt(0)} />
                          <div>
                            <div className="font-medium whitespace-nowrap text-foreground">{name}</div>
                            <Stars rating={psyc.rating} small />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex flex-wrap items-center gap-1">
                          {psyc.specialties.slice(0, 2).map((sp) => (
                            <Badge key={sp} label={sp} tone="brand" />
                          ))}
                          {psyc.specialties.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{psyc.specialties.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm whitespace-nowrap text-muted-foreground">
                        {MODALITY_LABEL[psyc.modality]}
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-20 rounded-full overflow-hidden bg-muted">
                            <div
                              className={cn("h-full rounded-full", occupancy >= 100 ? "bg-chart-5" : "bg-primary")}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground whitespace-nowrap">
                            {load.current}/{psyc.maxPatients}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <Badge label={s.label} tone={s.tone} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <Modal onClose={() => setSelectedId(null)} maxWidth="sm:max-w-lg" label={`Profesional ${fullName(selected)}`}>
          <ModalHeader onClose={() => setSelectedId(null)} sticky>
            <div className="flex items-center gap-3">
              <Avatar name={fullName(selected)} size="lg" initial={selected.lastName.charAt(0)} />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{lastFirst(selected)}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    label={PSYCH_STATUS[psychologistLoad(selected, assignments).status].label}
                    tone={PSYCH_STATUS[psychologistLoad(selected, assignments).status].tone}
                  />
                  <Stars rating={selected.rating} small />
                </div>
              </div>
            </div>
          </ModalHeader>
          <div className="px-6 py-5 space-y-4">
            {selected.bio && <p className="text-sm text-muted-foreground">{selected.bio}</p>}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(() => {
                const load = psychologistLoad(selected, assignments);
                return [
                  ["Email", selected.email],
                  ["Teléfono", selected.phone],
                  ["Experiencia", `${selected.yearsExperience} años`],
                  ["Modalidad", MODALITY_LABEL[selected.modality]],
                  ["Horario", selected.schedule],
                  ["Idiomas", selected.languages.join(", ")],
                  ["Pacientes actuales", `${load.current} / ${selected.maxPatients}`],
                  ["Cupos disponibles", String(load.available)],
                ];
              })().map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm text-foreground">{value}</dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground mb-1">Especialidades</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {selected.specialties.map((sp) => (
                    <Badge key={sp} label={sp} tone="brand" />
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </Modal>
      )}
    </div>
  );
}
