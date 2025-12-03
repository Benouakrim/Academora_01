import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { logError } from '@/hooks/useErrorLogger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    logError(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/20 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We encountered an unexpected error. Our team has been notified.
              </p>
              {this.state.error && (
                <div className="p-3 bg-muted rounded-md text-xs font-mono text-left overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  <Home className="w-4 h-4 mr-2" /> Home
                </Button>
                <Button onClick={this.handleReset}>
                  <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary