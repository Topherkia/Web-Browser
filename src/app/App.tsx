import { useState, useEffect } from 'react';
import { BrowserBar } from '@/app/components/BrowserBar';
import { HomePage } from '@/app/components/HomePage';
import { SearchResults } from '@/app/components/SearchResults';
import { WebsiteViewer } from '@/app/components/WebsiteViewer';
import { RatingComments } from '@/app/components/RatingComments';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/app/components/ui/resizable';

interface HistoryEntry {
  url: string;
  timestamp: number;
}

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('home');
  const [history, setHistory] = useState<HistoryEntry[]>([{ url: 'home', timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  // Update currentUrl when history changes
  useEffect(() => {
    setCurrentUrl(history[historyIndex]?.url || 'home');
  }, [historyIndex, history]);

  const navigateTo = (url: string) => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return;
    }

    const currentHistoryUrl = history[historyIndex]?.url;

    // Avoid duplicate consecutive entries
    if (currentHistoryUrl === trimmedUrl) {
      return;
    }

    // Remove any forward history when navigating to a new page
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ url: trimmedUrl, timestamp: Date.now() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const refresh = () => {
    // Force re-render by updating timestamp
    const newHistory = [...history];
    newHistory[historyIndex] = { 
      ...newHistory[historyIndex], 
      timestamp: Date.now() 
    };
    setHistory(newHistory);
  };

  const goHome = () => {
    navigateTo('home');
  };

  const renderContent = () => {
    if (currentUrl === 'home') {
      return <HomePage onNavigate={navigateTo} />;
    }

    if (currentUrl.startsWith('search:')) {
      const query = currentUrl.substring(7);
      return <SearchResults query={query} onNavigate={navigateTo} />;
    }

    return <WebsiteViewer url={currentUrl} />;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BrowserBar
        currentUrl={currentUrl}
        onNavigate={navigateTo}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={goHome}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        onToggleReviews={() => setShowReviews(!showReviews)}
        showReviews={showReviews}
      />

      <div className="flex-1 overflow-hidden">
        {showReviews ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60} minSize={30}>
              {renderContent()}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={25}>
              <RatingComments url={currentUrl} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
