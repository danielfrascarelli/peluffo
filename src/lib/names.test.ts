import { byLastName, initials, lastFirst } from "@/lib/names";

const ana = { firstName: "Ana María", lastName: "Silva" };

describe("names", () => {
  it("formats last name first", () => {
    expect(lastFirst(ana)).toBe("Silva, Ana María");
  });

  it("masks a name to initials", () => {
    expect(initials(ana)).toBe("A. M. S.");
  });

  it("sorts by last name using Spanish collation", () => {
    const people = [
      { firstName: "Ana", lastName: "Zubía" },
      { firstName: "Luis", lastName: "Álvarez" },
      { firstName: "Eva", lastName: "Martínez" },
    ];
    expect([...people].sort(byLastName).map((p) => p.lastName)).toEqual(["Álvarez", "Martínez", "Zubía"]);
  });
});
