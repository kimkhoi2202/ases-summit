import { supabase } from './supabase';

// Function to test Supabase connection
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Test 1: Simple ping to check if we can connect to the database
    const { error } = await supabase.from('contacts').select('count').limit(1);

    if (error) {
      return {
        success: false,
        message: 'Database connection failed',
        details: {
          error: error.message,
          code: error.code
        }
      };
    }

    // Test 2: Check if we can access the storage bucket
    try {
      // Try to directly access the contact-photos bucket instead of listing buckets
      try {
        // Try to list files in the bucket directly
        const { data: files, error: listFilesError } = await supabase.storage
          .from('contact-photos')
          .list();

        if (listFilesError) {
          console.error('Error listing files in bucket:', listFilesError);
          return {
            success: false,
            message: 'Database connected, but cannot access contact-photos bucket',
            details: {
              database: 'Connected',
              storage: `Failed to access bucket: ${listFilesError.message}`,
              error: listFilesError
            }
          };
        }

        console.log('Files in contact-photos bucket:', files);

        // If we get here, we can access the bucket
        return {
          success: true,
          message: 'Supabase connection successful',
          details: {
            database: 'Connected',
            storage: 'Connected',
            bucketName: 'contact-photos',
            fileCount: files.length,
            files: files.map(f => f.name)
          }
        };
      } catch (bucketError) {
        console.error('Error accessing bucket directly:', bucketError);

        // Try listing buckets as a fallback
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
          return {
            success: false,
            message: 'Database connected, but storage listing failed',
            details: {
              database: 'Connected',
              storage: `Failed to list buckets: ${listError.message}`,
              error: listError
            }
          };
        }

        console.log('Available buckets:', buckets);
        return {
          success: false,
          message: 'Database connected, but cannot access contact-photos bucket',
          details: {
            database: 'Connected',
            storage: 'Bucket access failed',
            availableBuckets: buckets?.map(b => b.name) || [],
            error: bucketError instanceof Error ? bucketError.message : 'Unknown error'
          }
        };
      }
    } catch (storageError) {
      console.error('Storage test error:', storageError);
      return {
        success: false,
        message: 'Database connected, but storage test failed',
        details: {
          database: 'Connected',
          storage: `Error: ${storageError instanceof Error ? storageError.message : 'Unknown error'}`,
          error: storageError
        }
      };
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      message: 'Supabase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to test image upload to Supabase storage
export const testImageUpload = async (imageFile: File): Promise<{
  success: boolean;
  message: string;
  url?: string;
  details?: any;
}> => {
  try {
    console.log('Starting test upload for file:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    // Test bucket permissions directly by trying to upload a small test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'permission-test.txt', { type: 'text/plain' });

    console.log('Testing upload permissions with a small test file');

    // Try to upload the test file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('contact-photos')
      .upload(`test-${Date.now()}.txt`, testFile);

    if (uploadError) {
      console.error('Upload permission test failed:', uploadError);

      // Check if it's a permissions issue
      if (uploadError.message.includes('permission') ||
          uploadError.message.includes('not authorized') ||
          uploadError.message.includes('policy')) {
        return {
          success: false,
          message: 'Permission denied when uploading to contact-photos bucket',
          details: {
            error: uploadError.message,
            hint: 'You need to add an INSERT policy for the contact-photos bucket in Supabase dashboard'
          }
        };
      }

      return {
        success: false,
        message: 'Error uploading to contact-photos bucket',
        details: {
          error: uploadError.message,
          hint: 'Check bucket configuration in Supabase dashboard'
        }
      };
    }

    console.log('Upload permission test successful:', uploadData);

    // Now test read permissions by trying to get the URL
    const { data: urlData } = supabase.storage
      .from('contact-photos')
      .getPublicUrl(uploadData.path);

    console.log('Public URL test:', urlData);

    // Generate a unique file name
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `test-${Date.now()}.${fileExt}`;

    console.log('Generated filename:', fileName);

    // Upload to Supabase storage with detailed options
    const { data, error } = await supabase.storage
      .from('contact-photos')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', {
        message: error.message,
        name: error.name
      });

      return {
        success: false,
        message: 'Upload failed',
        details: {
          error: error.message,
          hint: 'Check bucket policies in Supabase dashboard'
        }
      };
    }

    console.log('Upload successful, data:', data);

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('contact-photos')
      .getPublicUrl(fileName);

    return {
      success: true,
      message: 'Image upload successful',
      url: publicUrlData.publicUrl,
      details: {
        path: data?.path,
        fullPath: `contact-photos/${fileName}`
      }
    };
  } catch (error) {
    console.error('Error in testImageUpload:', error);
    return {
      success: false,
      message: 'Image upload failed',
      details: error instanceof Error
        ? { message: error.message, stack: error.stack }
        : 'Unknown error'
    };
  }
};
