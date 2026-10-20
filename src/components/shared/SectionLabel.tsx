export default function SectionLabel({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <p className="text-sm font-semibold mb-3 text-foreground">{children}</p>;
}
