import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page failed to render', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
        <div className="max-w-lg w-full rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
            <h1 className="text-lg font-semibold">The page could not load</h1>
          </div>
          <p className="mt-4 text-sm text-stone-700">Something went wrong while showing the site. Reload the page to try again.</p>
          <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-stone-100 p-3 text-xs text-stone-800 whitespace-pre-wrap">
            {this.state.error.message}
          </pre>
        </div>
      </div>
    );
  }
}
