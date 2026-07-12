export function getFileLinkExtension(link: string) {
  if (link.startsWith("data:")) {
    return "";
  }

  try {
    const pathname = new URL(link).pathname;
    return pathname.split(".").pop()?.toLowerCase() ?? "";
  } catch {
    return link.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  }
}

export function getDataUrlMimeType(link: string) {
  if (!link.startsWith("data:")) {
    return null;
  }

  return link.slice(5, link.indexOf(";")).toLowerCase();
}

export function isPdfFileLink(link: string) {
  return getFileLinkExtension(link) === "pdf" || getDataUrlMimeType(link) === "application/pdf";
}

export function isImageFileLink(link: string) {
  const mimeType = getDataUrlMimeType(link);

  return (
    mimeType?.startsWith("image/") === true ||
    ["apng", "avif", "gif", "jpeg", "jpg", "png", "svg", "webp"].includes(
      getFileLinkExtension(link)
    )
  );
}

export function getPdfViewerSource(url: string) {
  if (url.startsWith("data:")) {
    return url;
  }

  return `${url}#toolbar=1&navpanes=0&scrollbar=1`;
}

export async function getDisplayableFileUrl(url: string) {
  if (!url.startsWith("file://")) {
    return url;
  }

  if (!window.papyrusLocalFile) {
    throw new Error("Local file bridge is not available.");
  }

  return window.papyrusLocalFile.readFileAsDataUrl(url);
}
