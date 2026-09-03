import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Something went wrong</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Please reload the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
