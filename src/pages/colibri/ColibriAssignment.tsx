import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/shared/Avatar";
import Badge from "@/components/shared/Badge";
import ListItem from "@/components/shared/ListItem";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import ModalHeader from "@/components/shared/ModalHeader";
import Toast from "@/components/shared/Toast";
import { useDataWriters, usePatientRecords, usePsychologists } from "@/hooks/queries";
import { byLastName, fullName, initials, lastFirst } from "@/lib/names";
import { cn } from "@/lib/utils";

const thClass = "text-left px-4 py-3 text-xs font-medium text-muted-foreground bg-background/60";

export default function ColibriAssignment() {
  const { data: patients = [], isPending: patientsPending } = usePatientRecords();
  const { data: psychologists = [], isPending: psychsPending } = usePsychologists();
  const { assign, unassign } = useDataWriters();
  const [editingPsychId, setEditingPsychId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  if (patientsPending || psychsPending) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  const editingPsych = psychologists.find((p) => p.id === editingPsychId);
  const assignedTo = (psychId: string) => patients.filter((p) => p.current?.psychologistId === psychId);
  const sortedPsychs = [...psychologists].sort(byLastName);
  const unassigned = patients.filter((p) => p.status === "en_espera");

  const toggleAssignment = (patientId: string, psychId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    const psych = psychologists.find((p) => p.id === psychId);
    if (!patient || !psych) return;
    if (patient.current?.psychologistId === psychId) {
      unassign(patientId);
      showToast(`${initials(patient)} sin profesional`);
    } else {
      assign(patientId, psychId);
      showToast(`${initials(patient)} con ${lastFirst(psych)}`);
    }
  };

  return (
    <div>
      <Toast message={toast} />

      <p className="mb-5 text-sm text-muted-foreground">
        {unassigned.length > 0
          ? `${unassigned.length} paciente${unassigned.length !== 1 ? "s esperan" : " espera"} profesional`
          : "Todos los pacientes tienen profesional"}
      </p>

      <ul className="md:hidden bg-card rounded-xl border border-border divide-y divide-muted overflow-hidden">
        {sortedPsychs.map((psych) => {
          const assigned = assignedTo(psych.id);
          return (
            <li key={psych.id}>
              <ListItem
                leading={<Avatar name={fullName(psych)} initial={psych.lastName.charAt(0)} size="sm" />}
                title={lastFirst(psych)}
                subtitle={
                  assigned.length === 0 ? "Sin pacientes" : [...assigned].sort(byLastName).map(initials).join(", ")
                }
                trailing={
                  <span className="text-sm text-muted-foreground">
                    {assigned.length}/{psych.maxPatients}
                  </span>
                }
                onClick={() => setEditingPsychId(psych.id)}
              />
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className={thClass}>Profesional</th>
              <th className={thClass}>Pacientes asignados</th>
              <th className={thClass}>Carga</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody>
            {sortedPsychs.map((psych) => {
              const assigned = assignedTo(psych.id);
              return (
                <tr key={psych.id} className="border-t border-muted hover:bg-row-hover">
                  <td className="px-4 py-3.5 text-sm w-56 font-medium text-foreground">{lastFirst(psych)}</td>
                  <td className="px-4 py-3.5 text-sm">
                    {assigned.length === 0 ? (
                      <span className="text-muted-foreground">Sin pacientes</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {[...assigned].sort(byLastName).map((p) => (
                          <Badge key={p.id} label={initials(p)} tone="success" />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">
                    {assigned.length}/{psych.maxPatients}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button variant="secondary" onClick={() => setEditingPsychId(psych.id)}>
                      Asignar pacientes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingPsych && (
        <Modal
          onClose={() => setEditingPsychId(null)}
          maxWidth="sm:max-w-md"
          label={`Asignar pacientes a ${fullName(editingPsych)}`}
        >
          <ModalHeader onClose={() => setEditingPsychId(null)}>
            <h3 className="font-semibold text-foreground">{lastFirst(editingPsych)}</h3>
            <p className="text-sm mt-0.5 text-muted-foreground">Seleccioná los pacientes asignados</p>
          </ModalHeader>
          <div className="px-6 pb-4">
            <div className="space-y-2">
              {[...patients]
                .filter((p) => p.status !== "finalizado")
                .sort(byLastName)
                .map((patient) => {
                  const isAssigned = patient.current?.psychologistId === editingPsych.id;
                  const elsewhere = patient.current?.psychologistId && !isAssigned;
                  const other = elsewhere
                    ? psychologists.find((p) => p.id === patient.current?.psychologistId)
                    : undefined;
                  return (
                    <label
                      key={patient.id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 min-h-11 rounded-lg transition-colors border",
                        isAssigned
                          ? "bg-success border-success-foreground/30"
                          : elsewhere
                            ? "bg-background border-input"
                            : "bg-card border-input",
                        elsewhere ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        disabled={!!elsewhere}
                        onChange={() => toggleAssignment(patient.id, editingPsych.id)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{initials(patient)}</div>
                        <div className="text-xs text-muted-foreground">
                          {other ? `Con ${lastFirst(other)}` : patient.cedula ? `CI: ${patient.cedula}` : "Sin CI"}
                        </div>
                      </div>
                    </label>
                  );
                })}
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-muted">
            <Button variant="primary" onClick={() => setEditingPsychId(null)} className="flex-1 sm:flex-none">
              Listo
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
