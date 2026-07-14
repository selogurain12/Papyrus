import {
  getDataUrlMimeType,
  getDisplayableFileUrl,
  getFileLinkExtension,
  getPdfViewerSource,
  isImageFileLink,
  isPdfFileLink,
} from "../../../../apps/desktop/src/utils/files/file-link";

describe("file link utilities", () => {
  beforeEach(() => {
    Object.defineProperty(window, "papyrusLocalFile", {
      configurable: true,
      value: undefined,
    });
  });

  it("reads extension from URL pathname", () => {
    expect(getFileLinkExtension("https://example.com/files/document.PDF?download=true")).toBe(
      "pdf"
    );
  });

  it("detects PDF and image links", () => {
    expect(isPdfFileLink("https://example.com/document.pdf")).toBe(true);
    expect(isImageFileLink("https://example.com/image.png")).toBe(true);
  });

  it("detects data URL mime types", () => {
    expect(getDataUrlMimeType("data:image/png;base64,AAAA")).toBe("image/png");
    expect(isImageFileLink("data:image/png;base64,AAAA")).toBe(true);
    expect(isPdfFileLink("data:application/pdf;base64,AAAA")).toBe(true);
  });

  it("keeps data URLs unchanged and configures remote PDFs", () => {
    expect(getPdfViewerSource("data:application/pdf;base64,AAAA")).toBe(
      "data:application/pdf;base64,AAAA"
    );
    expect(getPdfViewerSource("https://example.com/document.pdf")).toBe(
      "https://example.com/document.pdf#toolbar=1&navpanes=0&scrollbar=1"
    );
  });

  it("keeps non-local file URLs unchanged", async () => {
    await expect(getDisplayableFileUrl("https://example.com/image.png")).resolves.toBe(
      "https://example.com/image.png"
    );
  });

  it("reads local files through the Electron bridge", async () => {
    const bridge = {
      openFile: jest.fn(),
      readFileAsDataUrl: jest.fn().mockResolvedValue("data:application/pdf;base64,AAAA"),
      saveFile: jest.fn(),
    };
    Object.defineProperty(window, "papyrusLocalFile", {
      configurable: true,
      value: bridge,
    });

    await expect(getDisplayableFileUrl("file:///tmp/document.pdf")).resolves.toBe(
      "data:application/pdf;base64,AAAA"
    );
    expect(bridge.readFileAsDataUrl).toHaveBeenCalledWith("file:///tmp/document.pdf");

    Object.defineProperty(window, "papyrusLocalFile", {
      configurable: true,
      value: undefined,
    });
  });

  it("fails clearly when local file bridge is missing", async () => {
    Object.defineProperty(window, "papyrusLocalFile", {
      configurable: true,
      value: undefined,
    });

    await expect(getDisplayableFileUrl("file:///tmp/document.pdf")).rejects.toThrow(
      "Local file bridge is not available."
    );
  });
});
