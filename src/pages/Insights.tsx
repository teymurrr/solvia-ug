
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Insights = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Solvia Insights</h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze your recruitment metrics and healthcare trends.
        </p>
        {/* Add insights content here */}
      </div>
    </MainLayout>
  );
};

export default Insights;
