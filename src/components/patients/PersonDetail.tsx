/**
 * Full detail panel for a patient.
 * Rendered inside a Modal by the parent.
 */
import Avatar from "@/components/shared/Avatar";
import DetailField from "@/components/shared/DetailField";
import SectionLabel from "@/components/shared/SectionLabel";
import { ageOn } from "@/lib/derive";
import { formatDate } from "@/lib/format";
import {
  END_REASON_LABEL,
  MODALITY_LABEL,
  HOW_LABEL,
  FEE_LABEL,
  MEDICATION_LABEL,
  SEX_LABEL,
  YES_NO_LABEL,
} from "@/lib/labels";
import { initials } from "@/lib/names";
import type { PatientRecord } from "@/lib/derive";
import { cn } from "@/lib/utils";

const grid = "grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3";

interface PersonDetailProps {
  patient: PatientRecord;
  psychologistName?: string;
  nameOfPsychologist: (id: string) => string;
  /** Extra content rendered after all sections (e.g. approve/reject buttons) */
  footer?: React.ReactNode;
}

export default function PersonDetail({ patient, psychologistName, nameOfPsychologist, footer }: PersonDetailProps) {
  const ageLabel = `${ageOn(patient.birthDate)} años · Nació el ${formatDate(patient.birthDate)}`;

  return (
    <div className="px-6 py-5 space-y-6">
      {/* Person header */}
      <div className="flex items-center gap-3">
        <Avatar name={initials(patient)} initial={patient.lastName.charAt(0)} size="lg" />
        <div>
          <h3 className="font-semibold text-lg text-foreground">{initials(patient)}</h3>
          <p className="text-sm text-muted-foreground">{ageLabel}</p>
        </div>
      </div>

      {/* Assigned psychologist */}
      {psychologistName && (
        <div className="p-3 rounded-lg bg-secondary">
          <p className="text-sm mb-0.5 text-primary">Profesional a cargo</p>
          <p className="text-sm font-medium text-sidebar">{psychologistName}</p>
        </div>
      )}

      {/* Urgency alert */}
      {patient.urgencySituation === "si" && (
        <div className="px-3 py-2 rounded-lg bg-warning border border-warning-foreground/20">
          <p className="text-sm font-semibold text-warning-foreground">
            ⚠️ Indicó situación de urgencia al registrarse
          </p>
        </div>
      )}

      <section>
        <SectionLabel>Datos personales</SectionLabel>
        <div className={grid}>
          <DetailField label="Cédula" value={patient.cedula} />
          <DetailField label="Sexo" value={patient.sex ? SEX_LABEL[patient.sex] : undefined} />
        </div>
      </section>

      <section>
        <SectionLabel>Contacto</SectionLabel>
        <div className={grid}>
          <DetailField label="Email" value={patient.email} />
          <DetailField label="Teléfono" value={patient.phone} />
          <DetailField label="Dirección" value={patient.address} />
          <DetailField label="Ciudad" value={patient.city} />
          <DetailField label="Departamento" value={patient.department} />
        </div>
      </section>

      <section>
        <SectionLabel>Solicitud</SectionLabel>
        {patient.motive && (
          <div className="bg-background rounded-lg p-4 mb-3">
            <p className="text-sm text-muted-foreground mb-1">Motivo de consulta</p>
            <p className="text-sm leading-relaxed text-foreground">{patient.motive}</p>
          </div>
        )}
        <div className={grid}>
          <DetailField label="Modalidad" value={MODALITY_LABEL[patient.modality]} />
          <DetailField label="Horario preferido" value={patient.preferredSchedule} />
          <DetailField label="Mutualista" value={patient.insurancePlan} />
          <DetailField
            label="Continuar con arancel"
            value={patient.continueWithFee ? FEE_LABEL[patient.continueWithFee] : undefined}
          />
          <DetailField
            label="Cómo llegó"
            value={patient.howDidYouHear ? (HOW_LABEL[patient.howDidYouHear] ?? patient.howDidYouHear) : undefined}
          />
          {patient.newsletterOptIn !== undefined && (
            <DetailField label="Novedades" value={patient.newsletterOptIn ? "Acepta recibir" : "No desea recibir"} />
          )}
        </div>
      </section>

      <section>
        <SectionLabel>Tratamiento</SectionLabel>
        <div className={grid}>
          <DetailField label="Inicio" value={formatDate(patient.startDate)} />
          {patient.endDate && <DetailField label="Finalización" value={formatDate(patient.endDate)} />}
          <DetailField
            label="Tratamiento previo"
            value={patient.previousTreatment ? YES_NO_LABEL[patient.previousTreatment] : undefined}
          />
          <DetailField
            label="Medicación"
            value={patient.currentMedication ? MEDICATION_LABEL[patient.currentMedication] : undefined}
          />
          {patient.diagnosis && (
            <div className="sm:col-span-2">
              <DetailField label="Diagnóstico" value={patient.diagnosis} />
            </div>
          )}
          {patient.notes && (
            <div className="sm:col-span-2">
              <DetailField label="Notas" value={patient.notes} />
            </div>
          )}
        </div>
      </section>

      {patient.history.length > 0 && (
        <section>
          <SectionLabel>Historial de profesionales</SectionLabel>
          <ol className="space-y-3">
            {[...patient.history].reverse().map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", a.endDate ? "bg-input" : "bg-primary")}
                />
                <div className="min-w-0 text-sm">
                  <div className="font-medium text-foreground">{nameOfPsychologist(a.psychologistId)}</div>
                  <div className="text-muted-foreground">
                    {formatDate(a.startDate)} – {a.endDate ? formatDate(a.endDate) : "actualidad"}
                    {a.endReason && ` · ${END_REASON_LABEL[a.endReason]}`}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Footer slot (e.g. action buttons) */}
      {footer && <div className="pt-2 border-t border-muted">{footer}</div>}
    </div>
  );
}
