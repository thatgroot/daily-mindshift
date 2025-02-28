
import React from 'react';
import { HabitProvider } from '@/contexts/HabitContext';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <HabitProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </HabitProvider>
  );
};

export default Index;
