export default function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}): React.JSX.Element | null {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm mb-0.5 text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
