const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const extractFolderId = (url: string) => {
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const listDriveFiles = async (folderId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}`,
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.files || [];
};

export const getFileBlob = async (fileId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`,
  );
  if (!response.ok) {
    throw new Error("Failed to download file");
  }
  return await response.blob();
};
