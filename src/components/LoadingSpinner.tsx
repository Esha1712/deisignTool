interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner = ({
  size = "medium",
  fullScreen = false,
  message,
}: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          border: `${spinnerSize / 10}px solid #f3f3f3`,
          borderTop: `${spinnerSize / 10}px solid #667eea`,
          borderRadius: "50%",
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          animation: "spin 1s linear infinite",
        }}
      />
      {message && (
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            margin: 0,
          }}
        >
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};
