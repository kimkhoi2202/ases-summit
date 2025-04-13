import React, { useState, useEffect } from 'react';
import { Button, Image as HeroImage, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';

interface PhotoUploadProps {
  onPhotoChange: (photoUrl: string | null) => void;
  initialPhotoUrl?: string | null;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange, initialPhotoUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhotoUrl || null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Set initial preview if provided
  useEffect(() => {
    if (initialPhotoUrl) {
      setPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);

    // Process the file to get data URL
    processFile(selectedFile);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Process file: compress and upload to Supabase
  const processFile = (selectedFile: File) => {
    // Compress image before uploading
    compressImage(selectedFile)
      .then(compressedFile => {
        // Set a loading state
        setUploadError(null);

        // Upload to Supabase
        uploadToSupabase(compressedFile)
          .then(url => {
            if (url) {
              // If Supabase upload succeeds, use the URL
              setPreviewUrl(url);
              onPhotoChange(url);
            } else {
              // If upload fails, fall back to data URL
              console.log('Supabase upload failed, falling back to data URL');
              const reader = new FileReader();

              reader.onload = (e) => {
                if (e.target?.result) {
                  const dataUrl = e.target.result.toString();
                  setPreviewUrl(dataUrl);
                  onPhotoChange(dataUrl);
                  console.log('Using data URL fallback (length):', dataUrl.length);
                }
              };

              reader.onerror = () => {
                setUploadError('Error reading file');
              };

              reader.readAsDataURL(compressedFile);
            }
          })
          .catch(error => {
            console.error('Error in file processing:', error);
            setUploadError('Error uploading image to storage. Please try again.');
          });
      })
      .catch(error => {
        console.error('Error compressing image:', error);
        setUploadError('Error processing image. Please try a different image.');
      });
  };

  // Upload file to Supabase storage
  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      console.log('Starting Supabase upload for file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Skip bucket existence check and try to upload directly
      // This is more reliable as the listBuckets API might have permission issues

      // Generate a unique file name
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      console.log('Generated filename:', fileName);

      // Try to upload to Supabase storage with minimal options
      // This matches the successful approach in the test page
      console.log('Uploading to bucket: contact-photos');
      const { data, error } = await supabase.storage
        .from('contact-photos')
        .upload(fileName, file);

      // Log the full response for debugging
      console.log('Upload response:', { data, error });

      if (error) {
        console.error('Supabase storage upload error:', {
          message: error.message,
          name: error.name,
          statusCode: error.statusCode,
          details: error.details,
          code: error.code
        });

        // Show more specific error messages based on the error
        if (error.message.includes('permission') ||
            error.message.includes('not authorized') ||
            error.message.includes('policy')) {
          console.error('Permission error details:', error);
          setUploadError('Permission denied. The bucket needs an INSERT policy.');

          // Fall back to data URL since we can't upload to Supabase
          console.log('Permission denied, falling back to data URL');
          const reader = new FileReader();

          reader.onload = (e) => {
            if (e.target?.result) {
              const dataUrl = e.target.result.toString();
              setPreviewUrl(dataUrl);
              onPhotoChange(dataUrl);
              console.log('Using data URL fallback due to permission issue');
            }
          };

          reader.onerror = () => {
            setUploadError('Error reading file');
          };

          reader.readAsDataURL(file);
          return null;
        } else if (error.statusCode === 413) {
          setUploadError('File too large. Please use a smaller image.');
        } else {
          setUploadError(`Upload error: ${error.message}`);
        }
        return null;
      }

      console.log('Upload successful, data:', data);

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('contact-photos')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrlData);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setUploadError(`Error: ${error.message}`);
      } else {
        setUploadError('Unknown error during upload');
      }
      return null;
    }
  };

  // Compress image to reduce size
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // If it's not an image or is already small, return the original file
      if (!file.type.startsWith('image/') || file.size < 500000) {
        resolve(file);
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file); // Fall back to original if canvas context not available
        return;
      }

      // Create object URL for the image
      const objectUrl = URL.createObjectURL(file);

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };

      // Set up onload handler
      img.onload = () => {
        // Clean up object URL
        URL.revokeObjectURL(objectUrl);

        // Calculate new dimensions (max 800px width/height)
        let width = img.width;
        let height = img.height;
        const maxSize = 800;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        // Resize image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with reduced quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          0.7 // Quality (0.7 = 70%)
        );
      };

      // Set the image source to start loading
      img.src = objectUrl;
    });
  };

  // Clear photo
  const handleClearPhoto = () => {
    setFile(null);
    setPreviewUrl(null);
    onPhotoChange(null);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 mb-4 overflow-hidden rounded-lg">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/400x400/6abcff/ffffff?text=Error";
                }}
              />
            </div>
            <Button
              variant="flat"
              color="danger"
              onPress={handleClearPhoto}
              startContent={<Icon icon="mdi:close" />}
              size="sm"
            >
              Remove Photo
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-500">
              <Icon icon="mdi:cloud-upload" className="text-4xl mx-auto mb-2" />
              <p className="text-sm">
                Drag and drop your photo here, or click to select a file
              </p>
              <p className="text-xs mt-1">
                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>
            <Button
              as="label"
              color="primary"
              variant="flat"
              className="cursor-pointer"
              htmlFor="file-upload"
              startContent={<Icon icon="mdi:file-image" />}
            >
              Select File
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </Button>
          </>
        )}
      </div>

      {uploadError && (
        <div className="mt-2 text-danger text-sm">
          <Icon icon="mdi:alert-circle" className="inline-block mr-1" />
          {uploadError}
        </div>
      )}
    </div>
  );
};
