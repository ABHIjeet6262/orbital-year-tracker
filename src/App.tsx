import React from 'react';
import { TrackerProvider } from './context/TrackerContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/layout/Dashboard';

export const App: React.FC = () => {
  return (
    <TrackerProvider>
      <div className="min-h-screen flex flex-col transition-colors duration-200">
        <Header />
        <Dashboard />
      </div>
    </TrackerProvider>
  );
};

export default App;
