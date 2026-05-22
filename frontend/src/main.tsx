import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { TooltipProvider } from './components/ui/Tooltip';
import { ThemedToaster } from './components/common/ThemedToaster';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <TooltipProvider delayDuration={200} skipDelayDuration={300}>
            <App />
          </TooltipProvider>
          <ThemedToaster />
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
