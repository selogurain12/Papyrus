import { useEffect, useState } from "react";

import { getDisplayableFileUrl } from "../utils/files/file-link";

function getInitialDisplayUrl(url: string | null) {
  return url?.startsWith("file://") ? null : url;
}

export function useDisplayableFileUrl(url: string | null) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(getInitialDisplayUrl(url));
  const [error, setError] = useState<Error | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!url) {
      setDisplayUrl(null);
      setError(null);
      setIsPreparing(false);
      return;
    }

    setDisplayUrl(getInitialDisplayUrl(url));
    setError(null);
    setIsPreparing(url.startsWith("file://"));

    void getDisplayableFileUrl(url)
      .then((nextUrl) => {
        if (isMounted) {
          setDisplayUrl(nextUrl);
          setIsPreparing(false);
        }
      })
      .catch((nextError: Error) => {
        if (isMounted) {
          setDisplayUrl(null);
          setError(nextError);
          setIsPreparing(false);
        }
        if (!nextError.message.includes("No handler registered")) {
          console.error("Unable to prepare local file for display", nextError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { displayUrl, error, isPreparing };
}
