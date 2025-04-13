import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Checkbox
} from "@heroui/react";
import { supabase, ContactFormData } from "../lib/supabase";
import { Icon } from "@iconify/react";
import { PhotoUpload } from "./photo-upload";
import { validatePhoneNumber, formatPhoneNumber } from "../utils/phone-formatter";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    category: 'delegate',
    name: '',
    title: '',
    bio: '',
    location: '',
    notes: '',
    photo_url: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    twitter: '',
    email: '',
    website: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [socialMediaFields, setSocialMediaFields] = useState({
    instagram: false,
    facebook: false,
    linkedin: false,
    youtube: false,
    twitter: false,
    email: false,
    website: false,
    phone: false
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSocialMediaField = (field: keyof typeof socialMediaFields) => {
    setSocialMediaFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));

    // Clear the field value if it's being disabled
    if (socialMediaFields[field]) {
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    // Required fields validation
    if (!formData.name.trim()) {
      setSubmitError("Name is required");
      return false;
    }
    if (!formData.title.trim()) {
      setSubmitError("Title is required");
      return false;
    }

    // Phone number validation
    if (socialMediaFields.phone && formData.phone) {
      if (!validatePhoneNumber(formData.phone)) {
        setSubmitError("Please enter a valid phone number. For international numbers, include the country code with a + prefix.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data - only include social media fields that are enabled
      // Create a base object with only the fields we know exist in the database
      // This helps prevent errors if the database schema doesn't match our form
      const dataToSubmit: any = {
        name: formData.name,
        category: formData.category,
        title: formData.title || null,
        is_approved: false, // Explicitly set is_approved to false for new submissions
      };

      // Only add social media fields if they're enabled and have values
      if (socialMediaFields.instagram && formData.instagram) dataToSubmit.instagram = formData.instagram;
      if (socialMediaFields.facebook && formData.facebook) dataToSubmit.facebook = formData.facebook;
      if (socialMediaFields.linkedin && formData.linkedin) dataToSubmit.linkedin = formData.linkedin;
      if (socialMediaFields.youtube && formData.youtube) dataToSubmit.youtube = formData.youtube;
      if (socialMediaFields.twitter && formData.twitter) dataToSubmit.twitter = formData.twitter;
      if (socialMediaFields.email && formData.email) dataToSubmit.email = formData.email;
      if (socialMediaFields.website && formData.website) dataToSubmit.website = formData.website;
      if (socialMediaFields.phone && formData.phone) dataToSubmit.phone = formData.phone;

      // Bio is required in the database schema, so always include it
      dataToSubmit.bio = formData.bio || '';

      // Add notes if it has a value
      if (formData.notes) dataToSubmit.notes = formData.notes;

      // Only add other optional fields if they have values
      if (formData.location) dataToSubmit.location = formData.location;
      if (formData.photo_url) dataToSubmit.photo_url = formData.photo_url;

      // is_approved is already set above, no need to check again

      // Handle photo URL
      if (dataToSubmit.photo_url) {
        console.log('Photo URL type:', dataToSubmit.photo_url.substring(0, 30) + '...');

        // Check if it's a data URL
        if (dataToSubmit.photo_url.startsWith('data:')) {
          console.log('Using data URL for photo (length):', dataToSubmit.photo_url.length);

          // If the data URL is too large (> 1MB), store a placeholder instead
          if (dataToSubmit.photo_url.length > 1000000) {
            console.log('Photo data URL is too large, using placeholder');
            dataToSubmit.photo_url = 'https://placehold.co/400x400/6abcff/ffffff?text=Photo+Too+Large';
          }
        } else {
          console.log('Using Supabase storage URL for photo');
        }
      } else {
        console.log('No photo URL provided');
      }

      // Log the data being submitted
      console.log('Submitting contact data:', {
        ...dataToSubmit,
        photo_url: dataToSubmit.photo_url ? 'URL present (not shown)' : null
      });

      try {
        // Submit to Supabase
        const { data, error } = await supabase
          .from('contacts')
          .insert([dataToSubmit])
          .select(); // Return the inserted data

        if (error) {
          console.error('Supabase insert error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('Submission successful, inserted data:', data);
      } catch (insertError) {
        console.error('Detailed insert error:', insertError);
        throw insertError;
      }

      // Reset form on success
      setFormData({
        category: 'delegate',
        name: '',
        title: '',
        bio: '',
        location: '',
        notes: '',
        photo_url: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        twitter: '',
        email: '',
        website: '',
        phone: ''
      });
      setSocialMediaFields({
        instagram: false,
        facebook: false,
        linkedin: false,
        youtube: false,
        twitter: false,
        email: false,
        website: false,
        phone: false
      });
      setSubmitSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);

      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        // Show more detailed error to help with debugging
        if (error.message.includes('payload') || error.message.includes('too large')) {
          setSubmitError('The image is too large. Please use a smaller image or try again without an image.');
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          setSubmitError('Permission error: The system cannot store images at this time. Please try again without an image.');
        } else if (error.message.includes('column')) {
          // Database schema error
          setSubmitError(`Database error: ${error.message}. Please contact the administrator.`);
          console.error('Database schema error detected. The form is trying to submit fields that don\'t exist in the database.');
        } else if (error.message.includes('not found')) {
          // Table not found error
          setSubmitError('Database configuration error. Please contact the administrator.');
          console.error('Table not found error. The contacts table might not exist or the user doesn\'t have access.');
        } else {
          setSubmitError(`Error: ${error.message}`);
        }
      } else {
        setSubmitError('There was a problem submitting your information. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Network Information</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Select
              label="Category"
              placeholder="Select your category"
              selectedKeys={[formData.category]}
              onChange={(e) => handleInputChange('category', e.target.value as 'organizer' | 'speaker' | 'delegate')}
              isRequired
            >
              <SelectItem key="delegate">Delegate</SelectItem>
              <SelectItem key="speaker">Speaker</SelectItem>
              <SelectItem key="organizer">Organizer</SelectItem>
            </Select>

            <Input
              label="Name"
              placeholder="Enter your full name"
              value={formData.name}
              onValueChange={(value) => handleInputChange('name', value)}
              isRequired
            />

            <Input
              label="Title"
              placeholder="Enter your title or role"
              value={formData.title}
              onValueChange={(value) => handleInputChange('title', value)}
              isRequired
            />

            <Textarea
              label="Bio (Optional)"
              placeholder="Write a short bio about yourself"
              value={formData.bio}
              onValueChange={(value) => handleInputChange('bio', value)}
              minRows={3}
              maxRows={5}
            />

            <Textarea
              label="Notes (Optional)"
              placeholder="Add any additional notes or information"
              value={formData.notes || ''}
              onValueChange={(value) => handleInputChange('notes', value)}
              minRows={2}
              maxRows={4}
            />

            <Input
              label="Location (Optional)"
              placeholder="Enter your location (e.g., City, Country)"
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Photo (Optional)
                <span className="text-xs text-gray-500 ml-1">(recommended size: 400x400px)</span>
              </label>
              <PhotoUpload
                onPhotoChange={(url) => handleInputChange('photo_url', url || '')}
                initialPhotoUrl={formData.photo_url || ''}
              />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-3">Contact Details</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select which contact methods you'd like to include and provide the relevant information.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.email}
                    onValueChange={() => toggleSocialMediaField('email')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Email"
                      placeholder="Enter your email address"
                      value={formData.email || ''}
                      onValueChange={(value) => handleInputChange('email', value)}
                      isDisabled={!socialMediaFields.email}
                      startContent={<Icon icon="mdi:email" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.phone}
                    onValueChange={() => toggleSocialMediaField('phone')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Phone"
                      placeholder="Enter your phone number (e.g. +1 123 456 7890)"
                      value={formData.phone || ''}
                      onValueChange={(value) => handleInputChange('phone', value)}
                      isDisabled={!socialMediaFields.phone}
                      startContent={<Icon icon="mdi:phone" className="text-gray-400" />}
                      description={socialMediaFields.phone ? "For international numbers, include the country code with a + prefix" : ""}
                    />
                    {socialMediaFields.phone && formData.phone && (
                      <div className="mt-1 text-xs text-gray-500">
                        Will be displayed as: {formatPhoneNumber(formData.phone)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.instagram}
                    onValueChange={() => toggleSocialMediaField('instagram')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Instagram"
                      placeholder="Enter your Instagram profile URL"
                      value={formData.instagram || ''}
                      onValueChange={(value) => handleInputChange('instagram', value)}
                      isDisabled={!socialMediaFields.instagram}
                      startContent={<Icon icon="mdi:instagram" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.facebook}
                    onValueChange={() => toggleSocialMediaField('facebook')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Facebook"
                      placeholder="Enter your Facebook profile URL"
                      value={formData.facebook || ''}
                      onValueChange={(value) => handleInputChange('facebook', value)}
                      isDisabled={!socialMediaFields.facebook}
                      startContent={<Icon icon="mdi:facebook" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.linkedin}
                    onValueChange={() => toggleSocialMediaField('linkedin')}
                  />
                  <div className="flex-1">
                    <Input
                      label="LinkedIn"
                      placeholder="Enter your LinkedIn profile URL"
                      value={formData.linkedin || ''}
                      onValueChange={(value) => handleInputChange('linkedin', value)}
                      isDisabled={!socialMediaFields.linkedin}
                      startContent={<Icon icon="mdi:linkedin" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.youtube}
                    onValueChange={() => toggleSocialMediaField('youtube')}
                  />
                  <div className="flex-1">
                    <Input
                      label="YouTube"
                      placeholder="Enter your YouTube channel URL"
                      value={formData.youtube || ''}
                      onValueChange={(value) => handleInputChange('youtube', value)}
                      isDisabled={!socialMediaFields.youtube}
                      startContent={<Icon icon="mdi:youtube" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.twitter}
                    onValueChange={() => toggleSocialMediaField('twitter')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Twitter"
                      placeholder="Enter your Twitter profile URL"
                      value={formData.twitter || ''}
                      onValueChange={(value) => handleInputChange('twitter', value)}
                      isDisabled={!socialMediaFields.twitter}
                      startContent={<Icon icon="mdi:twitter" className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    isSelected={socialMediaFields.website}
                    onValueChange={() => toggleSocialMediaField('website')}
                  />
                  <div className="flex-1">
                    <Input
                      label="Website"
                      placeholder="Enter your website URL"
                      value={formData.website || ''}
                      onValueChange={(value) => handleInputChange('website', value)}
                      isDisabled={!socialMediaFields.website}
                      startContent={<Icon icon="mdi:web" className="text-gray-400" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
              Your information has been submitted successfully! It will be reviewed by organizers before being published.
            </div>
          )}
        </form>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          color="primary"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          Submit Network Information
        </Button>
      </CardFooter>
    </Card>
  );
};
