import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { renderWithProviders, stubApi } from "@/test/renderWithProviders";

async function logIn(username: string, password: string): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup();
  renderWithProviders(<App />);
  await user.type(screen.getByLabelText("Usuario"), username);
  await user.type(screen.getByLabelText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
  return user;
}

// jsdom ignores CSS, so the desktop sidebar and the phone tab bar both render.
const sidebar = async (): Promise<HTMLElement> => (await screen.findAllByRole("navigation", { name: "Secciones" }))[0]!;

describe("App", () => {
  beforeEach(stubApi);
  afterEach(() => vi.unstubAllGlobals());

  it("rejects wrong credentials", async () => {
    await logIn("fibras", "wrong");
    expect(await screen.findByText("Usuario o contraseña incorrectos.")).toBeInTheDocument();
  });

  it("gives Fibras its sections", async () => {
    await logIn("fibras", "fibras");
    const nav = await sidebar();
    expect(within(nav).getByRole("button", { name: /Pacientes/ })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: /Psicólogos/ })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: /Estadísticas/ })).toBeInTheDocument();
  });

  it("gives Colibrí only Asignación", async () => {
    await logIn("colaborador.colibri", "pass123");
    const nav = await sidebar();
    expect(within(nav).getByRole("button", { name: /Asignación/ })).toBeInTheDocument();
    expect(within(nav).queryByRole("button", { name: /Pacientes/ })).not.toBeInTheDocument();
  });

  it("opens Mi perfil and logs out from the account menu", async () => {
    const user = await logIn("fibras", "fibras");

    await user.click(await screen.findByRole("button", { name: "Cuenta de Laura Fibras" }));
    await user.click(screen.getByRole("menuitem", { name: "Mi perfil" }));
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeInTheDocument();
    expect(screen.getByText("091 870 642")).toBeInTheDocument();
    expect(screen.getByText("l.fibras@salud.uy")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cuenta de Laura Fibras" }));
    await user.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));
    expect(screen.getByLabelText("Usuario")).toBeInTheDocument();
  });

  it("shows patients only by initials and psychologists as Apellido, Nombre", async () => {
    await logIn("fibras", "fibras");
    expect((await screen.findAllByText("E. C.")).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Elena/)).not.toBeInTheDocument();
    expect(screen.getAllByText("Rodríguez, Carlos").length).toBeGreaterThan(0);
  });
});
