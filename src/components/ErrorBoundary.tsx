import React, { ErrorInfo } from 'react';
import { Link, Redirect } from '@reach/router';

class ErrorBoundary extends React.Component {
  public state = { hasError: false, redirect: false };
  public static getDerivedStateFromError() {
    return { hasError: true };
  }
  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
  }
  public componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => this.setState({ redirect: true }), 5000);
    }
  }
  public render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1>
            There was an error with this listing <Link to="/">Click here</Link> to go back to the
            home page or wait 5 seconds
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
