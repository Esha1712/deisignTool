import { useEffect, useState } from "react";
import { getUserDiagrams } from "../services/diagram.service";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import type { Diagram } from "../types/diagram.types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const ownerDiagrams = await getUserDiagrams(user.uid);

      const allSnapshot = await getDocs(collection(db, "diagrams"));
      const sharedDiagrams = allSnapshot.docs
        .map((doc) => doc.data() as Diagram)
        .filter((d) => d.sharedWith?.[user.uid]);

      const combined = [
        ...ownerDiagrams,
        ...sharedDiagrams.filter(
          (sd) => !ownerDiagrams.find((od) => od.id === sd.id)
        ),
      ];

      setDiagrams(combined);
    };

    fetch();
  }, [user]);

  return (
  <div>
    <h2>Your Diagrams</h2>

    <button onClick={() => navigate("/diagram/new")}>
      + Create New Diagram
    </button>

    <div style={{ marginTop: 20 }}>
      {diagrams.length === 0 && <p>No diagrams yet.</p>}

      {diagrams.map((d) => (
        <div
          key={d.id}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <Link to={`/diagram/${d.id}`}>
            Open Diagram
          </Link>
          <div style={{ fontSize: 12, color: "#666" }}>
            ID: {d.id}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
