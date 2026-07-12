function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export async function saveLocalAttachment(file: File): Promise<string> {
  const data = await file.arrayBuffer();

  return `data:${file.type || "application/octet-stream"};base64,${arrayBufferToBase64(data)}`;
}
