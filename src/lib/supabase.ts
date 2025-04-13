import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrkpadjynxusuptwgtpx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ya3BhZGp5bnh1c3VwdHdndHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjE2ODYsImV4cCI6MjA1OTk5NzY4Nn0.9Py6khzq1uH5F01ZpHiIYnWju1diqUckN6ceLIoLHZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactFormData {
  category: 'organizer' | 'speaker' | 'delegate';
  name: string;
  title: string;
  bio: string;
  location: string;
  photo_url?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  email?: string;
  website?: string;
  phone?: string;
}

export interface Contact extends ContactFormData {
  id: string;
  is_approved: boolean;
  is_rejected?: boolean; // Optional since it might not exist in the database yet
  created_at: string;
  updated_at: string;
}
