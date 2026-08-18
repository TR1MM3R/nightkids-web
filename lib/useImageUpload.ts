import { useState } from "react";
import { upload } from "@vercel/blob/client";

// Upload lato client verso Vercel Blob, condiviso tra le sezioni admin
// (galleria, partner, archivio eventi) che caricano un'immagine opzionale.
export function useImageUpload(pathPrefix: string) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadFile = async (file: File): Promise<string> => {
        setIsUploading(true);
        setProgress(0);
        try {
            const blob = await upload(`${pathPrefix}/${Date.now()}-${file.name}`, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
                onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded / e.total) * 100));
                },
            });
            return blob.url;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading, progress };
}
