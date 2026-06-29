/* eslint-disable max-len */
import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PDFViewerModalProps {
  isOpen: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
}

export function PDFViewerModal({ isOpen, url, title, onClose }: PDFViewerModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !url) return null;

  const handleOpenExternal = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.open(url, "_blank");
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[90vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {title || t("pdfViewer")}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 flex flex-col items-center justify-center p-8">
          {error ? (
            <div className="text-center">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={handleOpenExternal}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t("openExternal")}</span>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <iframe
                src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={title || "PDF Viewer"}
                onError={() => {
                  setError(t("pdfLoadError"));
                }}
                onLoad={() => {
                  setError(null);
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-between">
          <p className="text-sm text-gray-500">{t("pdfTip")}</p>
          <button
            onClick={handleOpenExternal}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isLoading ? t("loading") : t("openExternal")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
