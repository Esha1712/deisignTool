import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              padding: "30px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h1 style={{ color: "#d63031", marginBottom: "20px" }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              We're sorry for the inconvenience. The application encountered an
              unexpected error.
            </p>
            {this.state.error && (
              <details style={{ marginBottom: "20px", textAlign: "left" }}>
                <summary style={{ cursor: "pointer", color: "#666" }}>
                  Error details
                </summary>
                <pre
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    overflow: "auto",
                    fontSize: "12px",
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                padding: "10px 20px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
