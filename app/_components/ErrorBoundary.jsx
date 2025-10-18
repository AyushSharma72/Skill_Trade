"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generate a unique error ID for tracking
    const eventId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      eventId
    });

    // Report to error tracking service (implement as needed)
    this.reportError(error, errorInfo, eventId);
  }

  reportError = (error, errorInfo, eventId) => {
    // This could be integrated with services like Sentry, LogRocket, etc.
    const errorReport = {
      eventId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(), // Implement based on your auth system
    };

    // For now, just log to console. In production, send to monitoring service
    console.group('🚨 Error Report');
    console.error('Event ID:', eventId);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Full Report:', errorReport);
    console.groupEnd();

    // Example: Send to monitoring service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(console.error);
  };

  getUserId = () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      return auth.user?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We're sorry for the inconvenience. An unexpected error occurred.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Message:</strong> {this.state.error?.message}
                </p>
                <p className="text-xs text-red-600">
                  <strong>Event ID:</strong> {this.state.eventId}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium text-red-800">
                    Technical Details
                  </summary>
                  <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap break-all">
                    {this.state.error?.stack}
                  </pre>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="w-full h-12"
              >
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If this problem persists, please{' '}
                <Link 
                  href="/contact-us" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  contact our support team
                </Link>
                {this.state.eventId && (
                  <span> and mention error ID: <code className="text-xs bg-gray-100 px-1 rounded">{this.state.eventId}</code></span>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with error boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for programmatic error handling
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, errorInfo = {}) => {
    // Log error
    console.error('Handled error:', error);
    
    // Report to error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...errorInfo
    };
    
    // Send to monitoring service
    console.error('Error Report:', errorReport);
  }, []);

  return { handleError };
};

export default ErrorBoundary;