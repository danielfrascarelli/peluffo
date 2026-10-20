export interface PersonName {
  firstName: string;
  lastName: string;
}

export const fullName = (p: PersonName): string => `${p.firstName} ${p.lastName}`;

export const lastFirst = (p: PersonName): string => `${p.lastName}, ${p.firstName}`;

export const initials = (p: PersonName): string =>
  [...p.firstName.split(" "), ...p.lastName.split(" ")]
    .filter(Boolean)
    .map((w) => `${w.charAt(0).toUpperCase()}.`)
    .join(" ");

export const byLastName = (a: PersonName, b: PersonName): number =>
  a.lastName.localeCompare(b.lastName, "es") || a.firstName.localeCompare(b.firstName, "es");
