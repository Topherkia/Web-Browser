interface Props {
  url: string;
}

export function WebsiteViewer({ url }: Props) {
  if (!url || url === "home") {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Enter a URL or search to begin.
      </div>
    );
  }

  return (
    <webview
      src={url}
      style={{ width: "100%", height: "100%" }}
      allowpopups
    />
  );
}
