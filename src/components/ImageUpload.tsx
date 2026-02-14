import { useState, useRef } from 'react';
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  id?: string; // storageId
  url: string;
}

interface ImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  bucket?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

const ImageUpload = ({
  value = [],
  onChange,
  bucket = 'product-images',
  multiple = true,
  maxFiles = 5,
  className
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} images allowed. Only first ${remainingSlots} will be uploaded.`,
        variant: 'destructive',
      });
    }

    setIsUploading(true);
    const newImages: UploadedImage[] = [];

    try {
      for (const file of filesToUpload) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not an image file`,
            variant: 'destructive',
          });
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds 5MB limit`,
            variant: 'destructive',
          });
          continue;
        }

        // 1. Generate Upload URL
        const postUrl = await generateUploadUrl();

        // 2. POST file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();

        // 3. Get URL for preview
        const url = await getFileUrl({ storageId });

        if (url) {
          newImages.push({ id: storageId, url });
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast({
          title: 'Upload successful',
          description: `${newImages.length} image(s) uploaded`,
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter(img => img.url !== urlToRemove));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
              <img
                src={img.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.url)}
                className="absolute top-1 right-1 p-1 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {value.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-primary/50 hover:bg-secondary/50',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Click to upload images</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB ({value.length}/{maxFiles})
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
