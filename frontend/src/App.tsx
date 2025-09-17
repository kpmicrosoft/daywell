import { useState, useEffect } from 'react';
import { PLAN_ENDPOINT } from './config';
import { loadRuntimeConfig } from './runtime-config';
import { TripPlannerForm } from './components/trip-planner-form';
import { EventsMap } from './components/events-map';
import { ItineraryView } from './components/itinerary-view';
import { ProfileView } from './components/profile-view';
import { BottomNavigation } from './components/bottom-navigation';
import { Logo } from './components/logo';

export default function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [hasCreatedTrip, setHasCreatedTrip] = useState(false);
  const [itineraryData, setItineraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Example: Load runtime config on mount
  useEffect(() => {
    loadRuntimeConfig()
      .then(config => {
        // You can now use config.VITE_GOOGLE_MAPS_API_KEY, etc.
        console.log('Loaded runtime config:', config);
      })
      .catch(err => {
        console.error('Failed to load runtime config:', err);
      });
  }, []);

  const handlePlanTrip = async (tripData: any) => {
    console.log('Trip planned:', tripData);
    setIsLoading(true);
    
    try {
      // Make API call to backend
  const response = await fetch(PLAN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create itinerary');
      }
      
      const data = await response.json();
      setItineraryData(data);
      setHasCreatedTrip(true);
      setActiveTab('itinerary');
    } catch (error) {
      console.error('Error creating itinerary:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'plan':
        return <TripPlannerForm onPlanTrip={handlePlanTrip} isLoading={isLoading} />;
      case 'itinerary':
        return <ItineraryView itineraryData={itineraryData} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <TripPlannerForm onPlanTrip={handlePlanTrip} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50">
      {/* Logo at the top of every page */}
      <Logo />
      {/* Main Content */}
      <main className="pb-16">
        {renderActiveView()}
      </main>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}