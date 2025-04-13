import React from 'react';
import { SupabaseTest } from '../components/supabase-test';
import { Hero } from '../components/hero';

export const SupabaseTestPage: React.FC = () => {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <SupabaseTest />
      </div>
    </>
  );
};
