import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import { testSupabaseConnection, testImageUpload } from '../lib/supabase-test';

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
  }>({});
  
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
    url?: string;
    details?: any;
  }>({});
  
  const [testing, setTesting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus({});
    
    try {
      const result = await testSupabaseConnection();
      console.log('Connection test result:', result);
      setConnectionStatus(result);
    } catch (error) {
      console.error('Unexpected error during connection test:', error);
      setConnectionStatus({
        success: false,
        message: 'Test failed with an unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };
  
  const handleTestImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setUploading(true);
    setUploadStatus({});
    
    try {
      const result = await testImageUpload(file);
      console.log('Upload test result:', result);
      setUploadStatus(result);
    } catch (error) {
      console.error('Unexpected error during upload test:', error);
      setUploadStatus({
        success: false,
        message: 'Upload test failed with an unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Connection Test</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <Button 
                color="primary"
                onPress={handleTestConnection}
                isLoading={testing}
              >
                Test Supabase Connection
              </Button>
              
              {connectionStatus.message && (
                <div className={`p-4 rounded-md ${connectionStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="font-medium">{connectionStatus.message}</p>
                  {connectionStatus.details && (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(connectionStatus.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Image Upload Test</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <Button
                  as="label"
                  color="primary"
                  variant="flat"
                  className="cursor-pointer"
                  isDisabled={uploading}
                >
                  {uploading ? <Spinner size="sm" /> : 'Select Image to Test Upload'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleTestImageUpload}
                    disabled={uploading}
                  />
                </Button>
              </div>
              
              {uploadStatus.message && (
                <div className={`p-4 rounded-md ${uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="font-medium">{uploadStatus.message}</p>
                  {uploadStatus.url && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Uploaded Image:</p>
                      <div className="mt-1 w-40 h-40 overflow-hidden rounded-md border border-gray-300">
                        <img 
                          src={uploadStatus.url} 
                          alt="Uploaded test" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 break-all">{uploadStatus.url}</p>
                    </div>
                  )}
                  {uploadStatus.details && (
                    <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(uploadStatus.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
