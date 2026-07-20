/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "./button";
import { useTranslation } from "react-i18next";

type FileUploadProps = {
  name?: string;
  label?: string;
  onFileSelected?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
};

const DEFAULT_ACCEPTED_FILE_TYPES = [
  "image/*",
  "application/pdf",
  "application/epub+zip",
  "video/*",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".epub",
  ".ppt",
  ".pptx",
].join(",");

const ACCEPTED_FILE_EXTENSIONS = [".epub", ".ppt", ".pptx"];
const ACCEPTED_FILE_MIME_TYPES = [
  "application/pdf",
  "application/epub+zip",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const ACCEPTED_FORMAT_LABEL_KEYS = [
  {
    labelKey: "file.format.images",
    values: ["image/*"],
  },
  {
    labelKey: "file.format.pdf",
    values: ["application/pdf", ".pdf"],
  },
  {
    labelKey: "file.format.epub",
    values: ["application/epub+zip", ".epub"],
  },
  {
    labelKey: "file.format.videos",
    values: ["video/*"],
  },
  {
    labelKey: "file.format.powerPoint",
    values: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".ppt",
      ".pptx",
    ],
  },
];

function isAcceptedFile(file: File): boolean {
  const fileName = file.name.toLowerCase();

  return (
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    ACCEPTED_FILE_MIME_TYPES.includes(file.type) ||
    ACCEPTED_FILE_EXTENSIONS.some((extension) => fileName.endsWith(extension))
  );
}

function getAcceptedFormatLabelKeys(accept: string): string[] {
  const acceptedValues = accept
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (acceptedValues.length === 0) {
    return ACCEPTED_FORMAT_LABEL_KEYS.map((format) => format.labelKey);
  }

  return ACCEPTED_FORMAT_LABEL_KEYS.filter((format) =>
    format.values.some((value) => acceptedValues.includes(value.toLowerCase()))
  ).map((format) => format.labelKey);
}

export function FileUpload({
  name = "file",
  label,
  onFileSelected,
  accept = DEFAULT_ACCEPTED_FILE_TYPES,
  maxSize = 10,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const acceptedFormatLabels = getAcceptedFormatLabelKeys(accept)
    .map((key) => t(key))
    .join(", ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const handleFileSelection = (file: File | null) => {
    if (file && maxSize && file.size > maxSize * 1024 * 1024) {
      alert(t("fileTooLarge", { maxSize }));
      return;
    }
    if (file && accept === DEFAULT_ACCEPTED_FILE_TYPES && !isAcceptedFile(file)) {
      alert(t("file.unsupportedType"));
      return;
    }
    setSelectedFile(file);
    onFileSelected?.(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelected?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">{label ?? t("file.label")}</label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all
          duration-200 cursor-pointer
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={handleChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`w-8 h-8 mb-3 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-blue-600">{t("file.select")}</span> {t("file.drop")}
          </p>
          <p className="text-xs text-gray-500">{t("file.maxSize", { maxSize })}</p>
          <p className="text-xs text-gray-500">
            {t("file.acceptedFormats", { formats: acceptedFormatLabels })}
          </p>
        </div>
      </div>

      {selectedFile && (
        // eslint-disable-next-line max-len
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
