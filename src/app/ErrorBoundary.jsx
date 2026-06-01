import React from "react";
import { Button } from "@components/ui";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center"
        }}>
          <h1>Something went wrong.</h1>
          <p>The application encountered an unexpected error.</p>
          <Button 
            onClick={() => window.location.href = "/"}
            style={{ marginTop: "1rem" }}
          >
            Return to Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
