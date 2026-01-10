// With the 'react-jsx' transform, we don't need to import React to use JSX.
// See: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}


interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', backgroundColor: '#2A2A2A', color: 'white', minHeight: '100vh' }}>
          <h1>Что-то пошло не так.</h1>
          <p>Пожалуйста, попробуйте перезапустить приложение.</p>
          <details style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
            <summary>Техническая информация</summary>
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
