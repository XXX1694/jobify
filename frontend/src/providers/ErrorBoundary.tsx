import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/common/Logo';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Last line of defence — catches render-time crashes anywhere in the tree. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Jobify crashed:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.assign('/');
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <p className="mono-label mb-3">Runtime exception</p>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            The interface hit a snag
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            An unexpected error broke this view. Reloading usually clears it.
          </p>
          <pre className="mt-5 max-h-32 overflow-auto rounded-xl border border-line bg-surface p-3 text-left font-mono text-2xs text-fg-faint">
            {error.message}
          </pre>
          <Button variant="primary" onClick={this.handleReload} className="mt-6">
            <RotateCw className="size-4" />
            Reload Jobify
          </Button>
        </div>
      </div>
    );
  }
}
