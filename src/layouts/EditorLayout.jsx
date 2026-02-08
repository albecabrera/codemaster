
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const EditorLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
};

export default EditorLayout;
