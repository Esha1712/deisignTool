import { useEffect, useState } from "react";
import { getUserDiagrams, getSharedDiagrams } from "../services/diagram.service";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import type { Diagram } from "../types/diagram.types";
import { showToast } from "../components/Toast";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchDiagrams = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ownedDiagrams, sharedDiagrams] = await Promise.all([
          getUserDiagrams(user.uid),
          getSharedDiagrams(user.uid),
        ]);

        const allDiagrams = [...ownedDiagrams, ...sharedDiagrams];
        
        allDiagrams.sort((a, b) => {
          const dateA = a.updatedAt?.seconds ?? 0;
          const dateB = b.updatedAt?.seconds ?? 0;
          return dateB - dateA;
        });

        setDiagrams(allDiagrams);
      } catch (err) {
        console.error("Error fetching diagrams:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load diagrams";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagrams();
  }, [user]);

  const handleCreateNew = () => {
    navigate("/diagram/new");
  };

  const getAccessBadge = (diagram: Diagram) => {
    if (!user) return null;

    const isOwner = diagram.ownerId === user.uid;
    const sharedRole = diagram.sharedWith?.[user.uid];

    if (isOwner) {
      return (
        <span
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "6px 16px",
            borderRadius: "25px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          }}
        >
          👑 Owner
        </span>
      );
    }

    if (sharedRole) {
      return (
        <span
          style={{
            background:
              sharedRole === "editor"
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "white",
            padding: "6px 16px",
            borderRadius: "25px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            boxShadow:
              sharedRole === "editor"
                ? "0 4px 15px rgba(16, 185, 129, 0.4)"
                : "0 4px 15px rgba(245, 158, 11, 0.4)",
          }}
        >
          {sharedRole === "editor" ? "✏️ Can Edit" : "👁️ View Only"}
        </span>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <LoadingSpinner size="large" message="Loading your diagrams..." />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "35px",
          padding: "50px 40px",
          marginBottom: "40px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.15)",
            }}
          >
            Your Diagrams
          </h1>
          <p
            style={{
              fontSize: "17px",
              opacity: 0.95,
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            Create, edit, and share beautiful visual diagrams with your team
          </p>
          
          <button
            onClick={handleCreateNew}
            style={{
              padding: "16px 36px",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(10px)",
              color: "white",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0, 0, 0, 0.15)";
            }}
          >
            Create New Diagram
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "20px 24px",
            background: "#fee",
            border: "2px solid #fcc",
            borderRadius: "20px",
            color: "#c00",
            marginBottom: "30px",
            fontWeight: "600",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {diagrams.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "35px",
            boxShadow: "0 6px 30px rgba(0, 0, 0, 0.08)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "100px",
              marginBottom: "24px",
              opacity: 0.2,
              filter: "grayscale(100%)",
            }}
          >
            📊
          </div>
          <h3
            style={{
              color: "#2d3748",
              marginBottom: "12px",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            No diagrams yet
          </h3>
          <p
            style={{
              color: "#718096",
              marginBottom: "32px",
              fontSize: "17px",
            }}
          >
            Create your first diagram to get started with visual design
          </p>
          <button
            onClick={handleCreateNew}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 10px 35px rgba(102, 126, 234, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 25px rgba(102, 126, 234, 0.4)";
            }}
          >
            Create First Diagram
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {diagrams.map((diagram) => (
            <Link
              key={diagram.id}
              to={`/diagram/${diagram.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                height: "100%",
              }}
            >
              <div
                style={{
                  padding: "28px",
                  background: "white",
                  borderRadius: "28px",
                  border: "2px solid #f0f0f0",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.06)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(102, 126, 234, 0.2)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%", // Circle!
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.35)",
                    }}
                  >
                    📊
                  </div>
                  {getAccessBadge(diagram)}
                </div>

                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#2d3748",
                  }}
                >
                  Diagram
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      background: "rgba(102, 126, 234, 0.08)",
                      borderRadius: "20px",
                      color: "#667eea",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {diagram.nodes?.length || 0}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      background: "rgba(102, 126, 234, 0.08)",
                      borderRadius: "20px",
                      color: "#667eea",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    <span>🔗</span>
                    {diagram.edges?.length || 0}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#a0aec0",
                    fontFamily: "monospace",
                    padding: "10px 14px",
                    background: "#f7fafc",
                    borderRadius: "16px",
                    marginTop: "auto",
                  }}
                >
                  ID: {diagram.id.substring(0, 12)}...
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
