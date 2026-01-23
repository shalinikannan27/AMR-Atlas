
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

enum Page {
  LANDING = 'landing',
  LOGIN = 'login',
  DASHBOARD = 'dashboard'
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {currentPage === Page.LANDING && (
        <LandingPage onCtaClick={() => navigateTo(Page.LOGIN)} />
      )}
      
      {currentPage === Page.LOGIN && (
        <LoginPage onLoginSuccess={() => navigateTo(Page.DASHBOARD)} />
      )}

      {currentPage === Page.DASHBOARD && (
        <Dashboard />
      )}
    </main>
  );
};

export default App;
