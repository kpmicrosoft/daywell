import { useState, useEffect } from 'react';
import { FAMILY_ENDPOINT } from '../config';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AutocompleteInput } from './ui/autocomplete-input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { MapPin, Calendar, DollarSign, Activity, MessageSquare, Users } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface FamilyMember {
  id: number;
  full_name: string;
  relationship: string;
}

interface TripPlannerFormProps {
  onPlanTrip: (tripData: any) => Promise<void>;
  isLoading?: boolean;
}

export function TripPlannerForm({ onPlanTrip, isLoading = false }: TripPlannerFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState([1000]);
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [selectedTravelers, setSelectedTravelers] = useState<number[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Fetch family members on component mount
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        // Assuming we're fetching for member ID 1 initially
  const response = await fetch(FAMILY_ENDPOINT);
        const data = await response.json();
        
        if (data.family_members) {
          setFamilyMembers([
            {
              id: data.member_id,
              full_name: data.full_name,
              relationship: data.relationship
            },
            ...data.family_members
          ]);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleTravelerToggle = (memberId: number) => {
    console.log('Toggling member:', memberId); // Debug log
    setSelectedTravelers(prev => {
      const newSelection = prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];
      console.log('New selection:', newSelection); // Debug log
      return newSelection;
    });
  };

  const handleActivityToggle = (activity: string) => {
    setActivityPreferences(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    // Use the formatted address or name as the destination
    const placeName = place.formatted_address || place.name || '';
    setDestination(placeName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get selected family member details
    const selectedFamilyMembers = familyMembers.filter(member => 
      selectedTravelers.includes(member.id)
    );
    
    // Separate adults and children
    const adults = selectedFamilyMembers.filter(member => 
      member.relationship === 'Parent' || member.relationship === 'Adult'
    );
    const children = selectedFamilyMembers.filter(member => 
      member.relationship === 'Child'
    );
    
    const tripData = {
      destination,
      startDate,
      endDate,
      budget: budget[0],
      activityPreferences,
      travelers: selectedFamilyMembers,
      adults: adults.map(a => a.full_name),
      children: children.map(c => c.full_name),
      adultsCount: adults.length,
      childrenCount: children.length,
      specialRequests
    };
    
    await onPlanTrip(tripData);
  };

  const activities = [
    { id: 'any', label: 'Any' },
    { id: 'hiking', label: 'Hiking' },
    { id: 'museums', label: 'Museums' },
    { id: 'cruises', label: 'Cruises' },
    { id: 'zoo', label: 'Zoo' },
    { id: 'theme parks', label: 'Theme Parks' },
    { id: 'camping', label: 'Camping' },
    { id: 'shopping', label: 'Shopping' },
  ];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="text-center text-card-foreground">
        <p>
          Tap. Plan. Play.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AutocompleteInput
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onPlaceSelect={handlePlaceSelect}
              className="h-12 text-gray-900"
            />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Travel Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-3'>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 text-gray-900"
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 text-gray-900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travelers - Family Members */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Family Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.length > 0 ? (
              <div className="space-y-3">
                <Label>Select travelers for this trip:</Label>
                <div className="flex flex-wrap gap-3">
                  {familyMembers.map((member) => {
                    const isSelected = selectedTravelers.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleTravelerToggle(member.id)}
                        className="px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 min-w-[120px] text-center"
                        style={{
                          backgroundColor: isSelected ? '#03438C' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#374151',
                          borderColor: isSelected ? '#03438C' : '#d1d5db'
                        }}
                      >
                        <p className="font-medium text-sm">{member.full_name}</p>
                        <p className="text-xs mt-1" style={{ color: isSelected ? '#dbeafe' : '#6b7280' }}>
                          {member.relationship}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading family members...</p>
            )}
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              Budget Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={500}
                max={10000}
                step={250}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <span className="text-lg">${budget[0].toLocaleString()}</span>
              <p className="text-sm text-muted-foreground">Total budget for the trip</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Preferences */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Activity Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {activities.map((activity) => (
                <Button
                  key={activity.id}
                  type="button"
                  variant={activityPreferences.includes(activity.id) ? "default" : "outline"}
                  onClick={() => handleActivityToggle(activity.id)}
                  className="h-10 px-4 flex items-center gap-3 hover:border-primary data-[state=checked]:border-primary"
                  style={activityPreferences.includes(activity.id) ? { backgroundColor: '#03438C', color: 'white' } : {}}
                >
                  <span className={`text-base ${activityPreferences.includes(activity.id) ? 'text-white' : 'text-gray-900'}`}>
                    {activity.label}
                  </span>
                </Button>
              ))}
            </div>
            {activityPreferences.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activityPreferences.map(pref => {
                  const activity = activities.find(a => a.id === pref);
                  return (
                    <Badge key={pref} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {activity?.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personalization */}
        <Card className="border border-primary/20 bg-white gap-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-[#03438C] font-semibold">
              <div className="w-9 h-9 bg-icon rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              Personalization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell our AI about any special needs, allergies, accessibility requirements, or specific activities you'd love to include!"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="min-h-20 text-gray-900"
              rows={3}
            />
            <p className="text-sm text-gray-600 mt-2">
              The more details you share, the better we can personalize your trip!
            </p>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full h-14 text-lg bg-create hover:bg-primary/90 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
          disabled={!destination || !startDate || !endDate || selectedTravelers.length === 0 || isLoading}
        >
          {isLoading ? 'Creating Your Itinerary...' : 'Create My Itinerary'}
        </Button>
      </form>
    </div>
  );
}