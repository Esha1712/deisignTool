import { useState } from "react";
import { getUserByEmail } from "../services/auth.service";
import { shareDiagram } from "../services/diagram.service";
import { showToast } from "./Toast";
import type { UserRole } from "../types/user.types";
import { COLORS } from "../constants";

interface ShareDialogProps {
  diagramId: string;
  onClose: () => void;
}

export const ShareDialog = ({ diagramId, onClose }: ShareDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) {
      showToast("Please enter an email address", "warning");
      return;
    }

    setIsSharing(true);

    try {
      const targetUser = await getUserByEmail(email.trim());

      if (!targetUser) {
        showToast("User not found with that email", "error");
        setIsSharing(false);
        return;
      }

      await shareDiagram(diagramId, targetUser.id, role);

      showToast(
        `Diagram shared successfully with ${email} as ${role}!`,
        "success"
      );
      setEmail("");
      onClose();
    } catch (error) {
      console.error("Error sharing diagram:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to share diagram",
        "error"
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "30px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            animation: "slideUp 0.3s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ margin: 0, color: COLORS.TEXT_PRIMARY }}>
              Share Diagram
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "28px",
                cursor: "pointer",
                color: COLORS.TEXT_MUTED,
                padding: 0,
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: COLORS.TEXT_SECONDARY,
                fontSize: "14px",
              }}
            >
              User Email
            </label>
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSharing}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.PRIMARY)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.BORDER)}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: COLORS.TEXT_SECONDARY,
                fontSize: "14px",
              }}
            >
              Access Level
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setRole("viewer")}
                disabled={isSharing}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: `2px solid ${
                    role === "viewer" ? COLORS.PRIMARY : COLORS.BORDER
                  }`,
                  background:
                    role === "viewer" ? COLORS.PRIMARY : "transparent",
                  color: role === "viewer" ? "white" : COLORS.TEXT_PRIMARY,
                  borderRadius: "6px",
                  cursor: isSharing ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                Viewer
                <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.9 }}>
                  Can view only
                </div>
              </button>
              <button
                onClick={() => setRole("editor")}
                disabled={isSharing}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: `2px solid ${
                    role === "editor" ? COLORS.SUCCESS : COLORS.BORDER
                  }`,
                  background:
                    role === "editor" ? COLORS.SUCCESS : "transparent",
                  color: role === "editor" ? "white" : COLORS.TEXT_PRIMARY,
                  borderRadius: "6px",
                  cursor: isSharing ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                Editor
                <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.9 }}>
                  Can edit
                </div>
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onClose}
              disabled={isSharing}
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: "6px",
                cursor: isSharing ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              style={{
                padding: "10px 20px",
                background: isSharing ? COLORS.TEXT_MUTED : COLORS.PRIMARY,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSharing ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                minWidth: "100px",
              }}
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
