import React, { useState } from "react";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import { storage, db } from "../../firebase"; // Import initialized Firebase services

type ImageUploadProps = {
  telegramUserId: string; // Pass in Telegram user ID
};

export function ImageUpload({ telegramUserId }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handle multiple image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      if (selectedImages.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }
      setImages(selectedImages);
    }
  };

  const handleUpload = async () => {
    if (images.length < 2) {
      alert("Please upload at least 2 images.");
      return;
    }
    setIsUploading(true);
    const uploadTasks = images.map((image, index) => {
      const imgRef = storageRef(storage, `images/${telegramUserId}/image${index + 1}`);
      return uploadBytesResumable(imgRef, image);
    });

    const uploadProgressArr: number[] = Array(images.length).fill(0);
    Promise.all(
      uploadTasks.map((uploadTask, index) =>
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgressArr[index] = progress;
            setUploadProgress([...uploadProgressArr]);
          },
          (error) => console.error("Upload failed:", error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await saveImageData(telegramUserId, downloadURL, index);
          }
        )
      )
    ).finally(() => {
      setIsUploading(false);
      console.log("All uploads completed.");
    });
  };

  const saveImageData = async (telegramUserId: string, downloadURL: string, index: number) => {
    const userImagesRef = dbRef(db, `users/${telegramUserId}/images/image${index + 1}`);
    await set(userImagesRef, downloadURL);
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={isUploading || images.length < 2}>
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>

      {uploadProgress.length > 0 && (
        <div>
          {uploadProgress.map((progress, index) => (
            <p key={index}>Image {index + 1}: {progress}% uploaded</p>
          ))}
        </div>
      )}
    </div>
  );
}
