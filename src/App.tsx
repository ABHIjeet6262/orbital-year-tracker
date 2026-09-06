import React from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/layout/Dashboard';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingTour } from './components/tour/OnboardingTour';

const AppContent: React.FC = () => {
  const { viewMode } = useTracker();

  if (viewMode === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Header />
      <Dashboard />
      <OnboardingTour />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
};

export default App;
