export default function Toast({ message }: { message: string | null }): React.JSX.Element | null {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-primary-foreground bg-primary transition-all">
      ✓ {message}
    </div>
  );
}
