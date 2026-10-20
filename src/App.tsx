import { useState } from "react";
import type { User } from "@/lib/schemas";
import Login from "@/pages/Login";
import Layout from "@/components/layout/Layout";
import Patients from "@/pages/patients/Patients";
import Psychologists from "@/pages/psychologists/Psychologists";
import Statistics from "@/pages/statistics/Statistics";
import ColibriAssignment from "@/pages/colibri/ColibriAssignment";
import Profile from "@/pages/profile/Profile";

export default function App(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      {(section) => {
        switch (section) {
          case "pacientes":
            return <Patients />;
          case "psicologos":
            return <Psychologists />;
          case "asignacion":
            return <ColibriAssignment />;
          case "estadisticas":
            return <Statistics />;
          case "perfil":
            return <Profile user={user} />;
          default:
            return null;
        }
      }}
    </Layout>
  );
}
