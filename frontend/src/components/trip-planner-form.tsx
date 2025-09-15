import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AutocompleteInput } from './ui/autocomplete-input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { MapPin, Calendar, DollarSign, Activity, MessageSquare, Users } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface TripPlannerFormProps {
  onPlanTrip: (tripData: any) => void;
}

export function TripPlannerForm({ onPlanTrip }: TripPlannerFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState([1000]);
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tripData = {
      destination,
      startDate,
      endDate,
      budget: budget[0],
      activityPreferences,
      adults,
      children,
      specialRequests
    };
    onPlanTrip(tripData);
  };

  const activities = [
    { id: 'outdoor', label: 'Outdoor Activities' },
    { id: 'indoor', label: 'Indoor Activities' }
  ];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-2xl text-gray-900 font-semibold">Plan Your Family Trip</h1>
        <p className="text-gray-600">
          Create the perfect itinerary for your family adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
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
              className="h-12 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
            />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Travel Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Travelers */}
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Travelers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="h-12 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Number of adults" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                  <SelectItem value="5">5 Adults</SelectItem>
                  <SelectItem value="6+">6+ Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger className="h-12 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Number of children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Children</SelectItem>
                  <SelectItem value="1">1 Child</SelectItem>
                  <SelectItem value="2">2 Children</SelectItem>
                  <SelectItem value="3">3 Children</SelectItem>
                  <SelectItem value="4">4 Children</SelectItem>
                  <SelectItem value="5+">5+ Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
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
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Activity Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <Button
                  key={activity.id}
                  type="button"
                  variant={activityPreferences.includes(activity.id) ? "default" : "outline"}
                  onClick={() => handleActivityToggle(activity.id)}
                  className="w-full h-auto p-4 flex items-center gap-3 justify-start border border-gray-300 hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                >
                  <span className="text-base text-gray-900">
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
        <Card className="border border-primary/20 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
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
              className="min-h-20 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary resize-none text-gray-900"
              rows={3}
            />
            <p className="text-sm text-gray-600 mt-2">
              The more details you share, the better we can personalize your trip!
            </p>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
          disabled={!destination || !startDate || !endDate || !adults}
        >
          Create My Itinerary
        </Button>
      </form>
    </div>
  );
}