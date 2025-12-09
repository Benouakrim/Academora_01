import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = 'image/*,.pdf',
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(
    value ? (value.endsWith('.pdf') ? 'pdf' : 'image') : null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Determine file type
      const isPDF = file.type === 'application/pdf';
      setFileType(isPDF ? 'pdf' : 'image');

      // Create preview for images
      if (!isPDF) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(file.name);
      }

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = response.data.url;
      onChange(uploadedUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
      setPreview(null);
      setFileType(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileType(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {preview ? (
        <div className="relative border rounded-lg overflow-hidden">
          {fileType === 'image' ? (
            <div className="relative aspect-video bg-muted">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-6 bg-muted flex items-center gap-3">
              <FileText className="h-10 w-10 text-red-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{preview}</p>
                <p className="text-xs text-muted-foreground">PDF Document</p>
              </div>
            </div>
          )}
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            'w-full border-2 border-dashed rounded-lg p-8 hover:bg-accent transition-colors',
            'flex flex-col items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-destructive'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images or PDF (max {maxSize}MB)
                </p>
              </div>
              <Upload className="h-5 w-5 text-muted-foreground mt-2" />
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
