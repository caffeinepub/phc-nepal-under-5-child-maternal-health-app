import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HealthModulesPage from './pages/HealthModulesPage';
import BabyPlanningPage from './pages/BabyPlanningPage';
import PregnancyTrackingPage from './pages/PregnancyTrackingPage';
import ANCPNCPage from './pages/ANCPNCPage';
import DangerSignsPage from './pages/DangerSignsPage';
import NutritionPage from './pages/NutritionPage';
import NewbornCarePage from './pages/NewbornCarePage';
import GrowthMonitoringPage from './pages/GrowthMonitoringPage';
import ImmunizationPage from './pages/ImmunizationPage';
import MilestonesPage from './pages/MilestonesPage';
import SupplementaryFeedingPage from './pages/SupplementaryFeedingPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import SplashScreen from './components/SplashScreen';
import { Toaster } from '@/components/ui/sonner';

type MainPage = 'dashboard' | 'health' | 'community' | 'profile' | 'about';
type SubPage =
  | 'babyPlanning'
  | 'pregnancy'
  | 'ancPnc'
  | 'dangerSigns'
  | 'nutrition'
  | 'newbornCare'
  | 'growth'
  | 'immunization'
  | 'milestones'
  | 'supplementaryFeeding';

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [mainPage, setMainPage] = useState<MainPage>('dashboard');
  const [subPage, setSubPage] = useState<SubPage | null>(null);

  const showSplash = isInitializing || (isAuthenticated && profileLoading);
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showSplash) return <SplashScreen />;
  if (!isAuthenticated) return <LoginPage />;

  const handleNavigateToModule = (page: SubPage | 'community' | 'about') => {
    if (page === 'community') {
      setSubPage(null);
      setMainPage('community');
    } else if (page === 'about') {
      setSubPage(null);
      setMainPage('about');
    } else {
      setSubPage(page as SubPage);
      setMainPage('health');
    }
  };

  const handleBottomNav = (page: MainPage) => {
    setMainPage(page);
    setSubPage(null);
  };

  const handleBack = () => setSubPage(null);

  const renderContent = () => {
    if (subPage) {
      switch (subPage) {
        case 'babyPlanning': return <BabyPlanningPage onBack={handleBack} />;
        case 'pregnancy': return <PregnancyTrackingPage onBack={handleBack} />;
        case 'ancPnc': return <ANCPNCPage onBack={handleBack} />;
        case 'dangerSigns': return <DangerSignsPage onBack={handleBack} />;
        case 'nutrition': return <NutritionPage onBack={handleBack} />;
        case 'newbornCare': return <NewbornCarePage onBack={handleBack} />;
        case 'growth': return <GrowthMonitoringPage onBack={handleBack} />;
        case 'immunization': return <ImmunizationPage onBack={handleBack} profile={userProfile ?? null} />;
        case 'milestones': return <MilestonesPage onBack={handleBack} />;
        case 'supplementaryFeeding': return <SupplementaryFeedingPage onBack={handleBack} />;
      }
    }

    switch (mainPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigateToModule}
            profile={userProfile ?? null}
          />
        );
      case 'health':
        return <HealthModulesPage onNavigate={(p) => setSubPage(p)} />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage profile={userProfile ?? null} />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage onNavigate={handleNavigateToModule} profile={userProfile ?? null} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 py-4 pb-24">
        {renderContent()}
      </main>
      <Footer />
      <BottomNav currentPage={mainPage} onNavigate={handleBottomNav} />
      {showProfileSetup && (
        <ProfileSetupModal
          open={showProfileSetup}
          onComplete={() => {/* query invalidated automatically */}}
        />
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
