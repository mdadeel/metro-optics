import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });

        // Send to error tracking service (Sentry, LogRocket, etc.)
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error, errorInfo) => {
        // Example integration with error tracking
        try {
            // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
            // or
            // LogRocket.captureException(error, { extra: errorInfo });
            console.log('Error would be sent to tracking service:', error, errorInfo);
        } catch (trackingError) {
            console.error('Failed to log error to service:', trackingError);
        }
    };

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        });
        window.location.href = '/';
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function' 
                    ? this.props.fallback(this.state.error, this.handleRetry)
                    : this.props.fallback;
            }

            // Default error UI (using existing styles)
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <AlertTriangle className="error-icon" size={64} />
                        <h1>Oops! Something went wrong</h1>
                        <p>
                            We're sorry for the inconvenience. The error has been logged and we'll fix it as soon as possible.
                            {this.state.retryCount > 0 && ` (Attempt ${this.state.retryCount + 1})`}
                        </p>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Dev Only)</summary>
                                <pre>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="error-button secondary"
                                onClick={this.handleRetry}
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <button
                                className="error-button primary"
                                onClick={this.handleReset}
                            >
                                <Home size={16} />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Async Error Boundary for handling async operations
class AsyncErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error) {
        console.error('AsyncErrorBoundary caught an error:', error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 text-center">
                    <p className="text-red-500">Something went wrong with this operation.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for handling async errors
const useErrorHandler = () => {
  return (error, errorInfo) => {
    console.error('Async error caught:', error, errorInfo);
    
    // You can integrate with error reporting service here
    // reportError(error, errorInfo)
  };
};

export default ErrorBoundary;
export { AsyncErrorBoundary, useErrorHandler };
