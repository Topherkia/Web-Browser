import { useEffect, useRef } from 'react';

interface Props {
  url: string;
}

export function WebsiteViewer({ url }: Props) {
  const webviewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.setAttribute('allowpopups', 'true');
    }
  }, [url]);

  if (!url || url === "home") {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Enter a URL or search to begin.
      </div>
    );
  }

  return (
    <webview
      ref={webviewRef as any}
      src={url}
      style={{ width: "100%", height: "100%" }}
      allowpopups
    />
  );
}