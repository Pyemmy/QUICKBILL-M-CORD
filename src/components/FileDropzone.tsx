import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, FileText, Loader2 } from 'lucide-react';

export interface FileDropzoneProps {
  label?: string;
  acceptText?: string;
  acceptedMimeTypes?: string[];
  maxSizeBytes?: number; // default 512KB or 2MB
  value?: string; // file URL or base64
  fileName?: string;
  onFileSelect: (dataUrl: string, file: File) => void;
  onClear?: () => void;
  isUploading?: boolean;
  uploadProgress?: number; // 0 - 100
  error?: string;
  helperText?: string;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  acceptText = 'PNG or SVG, up to 512KB',
  acceptedMimeTypes = ['image/png', 'image/svg+xml'],
  maxSizeBytes = 512 * 1024,
  value,
  fileName,
  onFileSelect,
  onClear,
  isUploading = false,
  uploadProgress = 0,
  error: externalError,
  helperText,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError || localError;

  const handleFile = (file: File) => {
    setLocalError(null);
    if (!file) return;

    // Validate size
    if (file.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      const maxKb = Math.round(maxSizeBytes / 1024);
      setLocalError(`File size exceeds limit (${maxSizeBytes >= 1024 * 1024 ? `${maxMb}MB` : `${maxKb}KB`})`);
      return;
    }

    // Validate mime type
    if (acceptedMimeTypes.length > 0) {
      const matches = acceptedMimeTypes.some((type) => {
        if (type.endsWith('/*')) {
          const prefix = type.split('/')[0];
          return file.type.startsWith(`${prefix}/`);
        }
        return file.type === type;
      });
      if (!matches && !file.name.endsWith('.pdf')) {
        setLocalError('Invalid file type. Please upload an accepted file format.');
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onFileSelect(dataUrl, file);
    };
    reader.onerror = () => {
      setLocalError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#344054]">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative flex items-center justify-between p-3.5 rounded-[10px] border border-[#E4E7EC] bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {value.startsWith('data:image') || value.startsWith('http') ? (
              <div className="w-10 h-10 rounded-[6px] border border-[#E4E7EC] bg-[#FAFAFA] flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-[6px] bg-[#EEF2FF] text-[#4C7DFF] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#0B1220] truncate">
                {fileName || 'Uploaded file'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Uploaded</span>
              </div>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-full text-[#667085] hover:text-[#DC3E3E] hover:bg-[#F2F4F7] transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? 'border-[#0B1220] bg-[#F2F4F7]'
              : error
              ? 'border-[#DC3E3E]/60 bg-[#FEF3F2]'
              : 'border-[#E4E7EC] bg-[#FAFAFA] hover:bg-white hover:border-[#D0D5DD]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={acceptedMimeTypes.join(',')}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#4C7DFF]" />
              <p className="text-xs font-medium text-[#0B1220]">
                Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E4E7EC] flex items-center justify-center text-[#667085] shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0B1220]">
                  Drop your file here, or{' '}
                  <span className="text-[#4C7DFF] hover:underline">browse</span>
                </p>
                <p className="text-xs text-[#667085] mt-0.5">{acceptText}</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-[#DC3E3E] font-medium flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[#667085] mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
