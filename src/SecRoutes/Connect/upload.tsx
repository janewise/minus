// import React, { useState } from "react";
// import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { ref as dbRef, set } from "firebase/database";
// import { storage, db } from "../../firebase"; // Import initialized Firebase services
// import "./connect.css";

// type ImageUploadProps = {
//   telegramUserId: string; // Pass in Telegram user ID
// };

// export function ImageUpload({ telegramUserId }: ImageUploadProps) {
//   const [images, setImages] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<number[]>([]);
//   const [isUploading, setIsUploading] = useState(false);

//   // Handle multiple image selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedImages = Array.from(e.target.files);
//       if (selectedImages.length > 2) {
//         alert("You can only upload a maximum of 4 images.");
//         return;
//       }
//       setImages(selectedImages);
//     }
//   };

//   const handleUpload = async () => {
//     if (images.length < 2) {
//       alert("Please upload at least 2 images.");
//       return;
//     }
//     setIsUploading(true);
//     const uploadTasks = images.map((image, index) => {
//       const imgRef = storageRef(storage, `images/${telegramUserId}/image${index + 1}`);
//       return uploadBytesResumable(imgRef, image);
//     });

//     const uploadProgressArr: number[] = Array(images.length).fill(0);
//     Promise.all(
//       uploadTasks.map((uploadTask, index) =>
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             uploadProgressArr[index] = progress;
//             setUploadProgress([...uploadProgressArr]);
//           },
//           (error) => console.error("Upload failed:", error),
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             await saveImageData(telegramUserId, downloadURL, index);
//           }
//         )
//       )
//     ).finally(() => {
//       setIsUploading(false);
//       console.log("All uploads completed.");
//     });
//   };

//   const saveImageData = async (telegramUserId: string, downloadURL: string, index: number) => {
//     const userImagesRef = dbRef(db, `users/${telegramUserId}/images/image${index + 1}`);
//     await set(userImagesRef, {
//       url: downloadURL,
//       isProcessed: false // Add a boolean field with value false
//     });
//   };
  

//   return (
//     <div className="upload">
//       <input type="file" accept="image/*" multiple onChange={handleImageChange} />
//       <button onClick={handleUpload} disabled={isUploading || images.length < 2}>
//         {isUploading ? "Uploading..." : "Upload Images"}
//       </button>

//       {uploadProgress.length > 0 && (
//         <div>
//           {uploadProgress.map((progress, index) => (
//             <p key={index}>Image {index + 1}: {progress}% uploaded</p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

//02
// import React, { useState } from "react";
// import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { ref as dbRef, set } from "firebase/database";
// import { storage, db } from "../../firebase"; // Import initialized Firebase services

// type ImageUploadProps = {
//   telegramUserId: string; // Pass in Telegram user ID
// };

// export function ImageUpload({ telegramUserId }: ImageUploadProps) {
//   const [images, setImages] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<number[]>([]);
//   const [isUploading, setIsUploading] = useState(false);

//   // Handle multiple image selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedImages = Array.from(e.target.files);
//       if (selectedImages.length > 4) {
//         alert("You can only upload a maximum of 4 images.");
//         return;
//       }
//       setImages(selectedImages);
//     }
//   };

//   const handleUpload = async () => {
//     if (images.length < 2) {
//       alert("Please upload at least 2 images.");
//       return;
//     }
//     setIsUploading(true);
//     const uploadTasks = images.map((image, index) => {
//       const imgRef = storageRef(storage, `images/${telegramUserId}/image${index + 1}`);
//       return uploadBytesResumable(imgRef, image);
//     });

//     const uploadProgressArr: number[] = Array(images.length).fill(0);
//     Promise.all(
//       uploadTasks.map((uploadTask, index) =>
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             uploadProgressArr[index] = progress;
//             setUploadProgress([...uploadProgressArr]);
//           },
//           (error) => console.error("Upload failed:", error),
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             await saveImageData(telegramUserId, downloadURL, index);
//           }
//         )
//       )
//     ).finally(() => {
//       setIsUploading(false);
//       console.log("All uploads completed.");
//     });
//   };

//   const saveImageData = async (telegramUserId: string, downloadURL: string, index: number) => {
//     const userImagesRef = dbRef(db, `users/${telegramUserId}/images/image${index + 1}`);
//     await set(userImagesRef, downloadURL);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" multiple onChange={handleImageChange} />
//       <button onClick={handleUpload} disabled={isUploading || images.length < 2}>
//         {isUploading ? "Uploading..." : "Upload Images"}
//       </button>

//       {uploadProgress.length > 0 && (
//         <div>
//           {uploadProgress.map((progress, index) => (
//             <p key={index}>Image {index + 1}: {progress}% uploaded</p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


//03
// import React, { useState } from "react";
// import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { ref as dbRef, set } from "firebase/database";
// import { storage, db } from "../../firebase"; // Import initialized Firebase services
// import "./connect.css";

// type ImageUploadProps = {
//   telegramUserId: string; // Pass in Telegram user ID
// };

// export function ImageUpload({ telegramUserId }: ImageUploadProps) {
//   const [images, setImages] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<number[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [pending, setPending] = useState(false); // New state to track pending status

//   // Handle multiple image selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedImages = Array.from(e.target.files);
//       if (selectedImages.length > 2) {
//         alert("You can only upload a maximum of 4 images.");
//         return;
//       }
//       setImages(selectedImages);
//       setPending(false); // Reset pending state when selecting new images
//     }
//   };

//   const handleUpload = async () => {
//     if (images.length < 2) {
//       alert("Please upload at least 2 images.");
//       return;
//     }
  
//     setIsUploading(true);
//     const uploadProgressArr: number[] = Array(images.length).fill(0);
    
//     // Track promises of all uploads
//     const uploadTasks = images.map((image, index) => {
//       const imgRef = storageRef(storage, `images/${telegramUserId}/image${index + 1}`);
      
//       // Upload each image with progress tracking
//       const uploadTask = uploadBytesResumable(imgRef, image);
      
//       return new Promise<void>((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             uploadProgressArr[index] = progress;
//             setUploadProgress([...uploadProgressArr]);
//           },
//           (error) => {
//             console.error("Upload failed:", error);
//             reject(error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             await saveImageData(telegramUserId, downloadURL, index);
//             resolve(); // Resolve the promise when the upload is complete
//           }
//         );
//       });
//     });
  
//     // Wait for all upload tasks to complete
//     Promise.all(uploadTasks)
//       .then(() => {
//         console.log("All uploads completed.");
//         setIsUploading(false);
//         setPending(true); // Set pending state only after all uploads are complete
//       })
//       .catch((error) => {
//         console.error("Error in uploading:", error);
//         setIsUploading(false); // Ensure uploading state is reset even if an error occurs
//       });
//   };
  
//   const saveImageData = async (telegramUserId: string, downloadURL: string, index: number) => {
//     const userImagesRef = dbRef(db, `users/${telegramUserId}/images/image${index + 1}`);
//     await set(userImagesRef, {
//       url: downloadURL,
//       isProcessed: false // Add a boolean field with value false
//     });
//   };

//   const handleReupload = () => {
//     setPending(false); // Reset pending state to allow reupload
//     setUploadProgress([]); // Reset upload progress
//     setImages([]); // Clear the images so new ones can be uploaded
//   };

//   return (
//     <div className="upload">
//       {!pending ? ( // Show file input and upload button if not in pending state
//         <>
//           <input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={isUploading} />
//           <button onClick={handleUpload} disabled={isUploading || images.length < 2}>
//             {isUploading ? "Uploading..." : "Upload Images"}
//           </button>

//           {uploadProgress.length > 0 && (
//             <div>
//               {uploadProgress.map((progress, index) => (
//                 <p key={index}>Image {index + 1}: {progress}% uploaded</p>
//               ))}
//             </div>
//           )}
//         </>
//       ) : ( // Show "Pending" text and "Reupload" button if in pending state
//         <div>
//           <p>Pending</p>
//           <button onClick={handleReupload}>Reupload</button>
//         </div>
//       )}
//     </div>
//   );
// }


//04
import React, { useState, useEffect } from "react";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set,update } from "firebase/database";
import { storage, db } from "../../firebase"; // Import initialized Firebase services
import "./connect.css";

type ImageUploadProps = {
  telegramUserId: string; // Pass in Telegram user ID
};

export function ImageUpload({ telegramUserId }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pending, setPending] = useState<boolean>(() => {
    // Get pending state from local storage on component mount
    const storedPending = localStorage.getItem(`pending_${telegramUserId}`);
    return storedPending ? JSON.parse(storedPending) : false;
  });

  useEffect(() => {
    // Save pending state to local storage whenever it changes
    localStorage.setItem(`pending_${telegramUserId}`, JSON.stringify(pending));
  }, [pending, telegramUserId]);

  // Handle multiple image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      if (selectedImages.length > 2) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }
      setImages(selectedImages);
      setPending(false); // Reset pending state when selecting new images
    }
  };

  const handleUpload = async () => {
    if (images.length < 2) {
      alert("Please upload at least 2 images.");
      return;
    }
  
    setIsUploading(true);
    const uploadProgressArr: number[] = Array(images.length).fill(0);
    
    // Track promises of all uploads
    const uploadTasks = images.map((image, index) => {
      const imgRef = storageRef(storage, `images/${telegramUserId}/image${index + 1}`);
      
      // Upload each image with progress tracking
      const uploadTask = uploadBytesResumable(imgRef, image);
      
      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgressArr[index] = progress;
            setUploadProgress([...uploadProgressArr]);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await saveImageData(telegramUserId, downloadURL, index);
            resolve(); // Resolve the promise when the upload is complete
          }
        );
      });
    });
  
    // Wait for all upload tasks to complete
    Promise.all(uploadTasks)
      .then(() => {
        console.log("All uploads completed.");
        setIsUploading(false);
        setPending(true); // Set pending state only after all uploads are complete
      })
      .catch((error) => {
        console.error("Error in uploading:", error);
        setIsUploading(false); // Ensure uploading state is reset even if an error occurs
      });
  };
  

  // Save image data to Firebase with the correct structure
  const saveImageData = async (telegramUserId: string, downloadURL: string, index: number) => {
    const imageKey = `image${index + 1}`; // Dynamically generate image key (image1, image2, etc.)
    const userImagesRef = dbRef(db, `users/${telegramUserId}/images`);
    
    await update(userImagesRef, {
      [imageKey]: downloadURL,  // Save image URL under image1, image2, etc.
      imageverified: false      // Set imageverified to false
    });
  };

  const handleReupload = () => {
    setPending(false); // Reset pending state to allow reupload
    setUploadProgress([]); // Reset upload progress
    setImages([]); // Clear the images so new ones can be uploaded
  };

  return (
    <div className="upload">
      {!pending ? ( // Show file input and upload button if not in pending state
        <>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={isUploading} />
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
        </>
      ) : ( // Show "Pending" text and "Reupload" button if in pending state
        <div>
          <p>Pending</p>
          <button onClick={handleReupload}>Reupload</button>
        </div>
      )}
    </div>
  );
}
