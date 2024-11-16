import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  value: string[]; // Preview URLs
  maxImages: number;
  maxSize: number;
}

export function ImageUpload({
  onChange,
  value,
  maxImages,
  maxSize,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }

      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          alert(
            `File ${file.name} is too large. Maximum size is ${
              maxSize / 1024 / 1024
            }MB`
          );
          return false;
        }
        return true;
      });

      onChange(validFiles);
    },
    [value.length, onChange, maxImages, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxImages - value.length,
  });

  const removeImage = (index: number) => {
    URL.revokeObjectURL(value[index]);
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary" : "border-muted-foreground/25",
          value.length >= maxImages && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            {value.length} of {maxImages} images uploaded
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <ScrollArea className="h-72 rounded-md border">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {value.map((previewUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={previewUrl}
                  alt={`Upload ${index + 1}`}
                  className="rounded-lg object-cover w-full aspect-video"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
