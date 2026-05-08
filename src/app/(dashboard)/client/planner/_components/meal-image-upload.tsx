"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateMealImage } from "../_services/useMealPlanMutation";

type Props = {
  planItemId: number;
  currentImage: string | null;
};

export default function MealImageUpload({ planItemId, currentImage }: Props) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateImage = useUpdateMealImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);

    try {
      // upload directly to Cloudinary using unsigned upload preset
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "mealio");
      formData.append("folder", "meal-planner");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const imageUrl: string = data.secure_url;

      // save URL to DB
      await updateImage.mutateAsync({ planItemId, imageUrl });
      setPreviewUrl(imageUrl);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    await updateImage.mutateAsync({ planItemId, imageUrl: null });
    setPreviewUrl(null);
    toast.success("Photo removed");
  };

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-40">
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Meal photo"
            fill
            className="object-cover"
          />
          {/* Overlay buttons on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="gap-1.5"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Camera className="size-3" />
              )}
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="gap-1.5"
              onClick={handleRemoveImage}
              disabled={uploading}
            >
              <X className="size-3" />
              Remove
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border-muted-foreground/20 hover:border-primary hover:bg-primary/5 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <p className="text-muted-foreground text-xs">Uploading...</p>
            </>
          ) : (
            <>
              <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <Camera className="text-muted-foreground size-5" />
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  Add meal photo
                </p>
                <p className="text-muted-foreground text-xs">
                  Optional · Max 5MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
