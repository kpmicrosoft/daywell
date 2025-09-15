import { useState } from 'react';
import { TripPlannerForm } from './components/trip-planner-form';
import { EventsMap } from './components/events-map';
import { ItineraryView } from './components/itinerary-view';
import { ProfileView } from './components/profile-view';
import { BottomNavigation } from './components/bottom-navigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [hasCreatedTrip, setHasCreatedTrip] = useState(false);

  const handlePlanTrip = (tripData: any) => {
    console.log('Trip planned:', tripData);
    setHasCreatedTrip(true);
    setActiveTab('itinerary');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'plan':
        return <TripPlannerForm onPlanTrip={handlePlanTrip} />;
      case 'itinerary':
        return <ItineraryView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <TripPlannerForm onPlanTrip={handlePlanTrip} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50">
      {/* Main Content */}
      <main className="pb-16">
        {renderActiveView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}