import { useEffect, useState } from "react";
import { getUserDiagrams } from "../services/diagram.service";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import type { Diagram } from "../types/diagram.types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);

  useEffect(() => {
    if (user) {
      getUserDiagrams(user.uid).then(setDiagrams);
    }
  }, [user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/diagram/new">Create New</Link>

      {diagrams.map(d => (
        <div key={d.id}>
          <Link to={`/diagram/${d.id}`}>{d.id}</Link>
        </div>
      ))}
    </div>
  );
}
