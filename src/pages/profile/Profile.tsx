import Avatar from "@/components/shared/Avatar";
import { ROLE_LABEL } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { User } from "@/lib/schemas";

export default function Profile({ user }: { user: User }): React.JSX.Element {
  const name = fullName(user);
  const fields = [
    { label: "Nombre", value: name },
    { label: "Teléfono", value: user.phone, href: `tel:${user.phone.replaceAll(" ", "")}` },
    { label: "Email", value: user.email, href: `mailto:${user.email}` },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar name={name} src={user.avatarUrl} size="xl" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">{ROLE_LABEL[user.role]}</p>
        </div>
      </div>

      <dl className="bg-card rounded-xl border border-border divide-y divide-muted">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
            <dt className="sm:w-32 shrink-0 text-sm text-muted-foreground">{f.label}</dt>
            <dd className="text-foreground">
              {f.href ? (
                <a href={f.href} className="hover:text-primary underline-offset-4 hover:underline">
                  {f.value}
                </a>
              ) : (
                f.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
