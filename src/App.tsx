import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, logout } from "@/api/auth";
import { setSessionExpiredHandler } from "@/lib/http";
import type { User } from "@/lib/schemas";
import Login from "@/pages/Login";
import Layout from "@/components/layout/Layout";
import Patients from "@/pages/patients/Patients";
import Psychologists from "@/pages/psychologists/Psychologists";
import Statistics from "@/pages/statistics/Statistics";
import ColibriAssignment from "@/pages/colibri/ColibriAssignment";
import Profile from "@/pages/profile/Profile";

export default function App(): React.JSX.Element | null {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [restoring, setRestoring] = useState(true);

  // Cached patient data must not outlive the session that fetched it.
  const endSession = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setSessionExpiredHandler(endSession);
    fetchCurrentUser()
      .then(setUser, () => setUser(null))
      .finally(() => setRestoring(false));
  }, [endSession]);

  if (restoring) return null;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout user={user} onLogout={() => void logout().then(endSession, endSession)}>
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
