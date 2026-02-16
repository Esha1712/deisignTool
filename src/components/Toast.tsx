import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCallbacks: ((toast: Toast) => void)[] = [];

export const showToast = (message: string, type: ToastType = "info") => {
  const toast: Toast = {
    id: crypto.randomUUID(),
    message,
    type,
  };
  toastCallbacks.forEach((callback) => callback(toast));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const callback = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };

    toastCallbacks.push(callback);

    return () => {
      toastCallbacks = toastCallbacks.filter((cb) => cb !== callback);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyle = (type: ToastType): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: "12px 20px",
      borderRadius: "6px",
      marginBottom: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      minWidth: "300px",
      animation: "slideIn 0.3s ease-out",
    };

    const typeStyles: Record<ToastType, React.CSSProperties> = {
      success: { background: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
      error: { background: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
      warning: { background: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" },
      info: { background: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" },
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={getToastStyle(toast.type)}>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                marginLeft: "15px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                opacity: 0.7,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
