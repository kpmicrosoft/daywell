import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Clock, Users, Star, Plus } from 'lucide-react';

interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  notes?: string;
}

interface ItineraryDay {
  date: string;
  items: ItineraryItem[];
}

export function ItineraryView() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events data for map
  const events = [
    {
      id: '1',
      title: 'Family Fun Day at Central Park',
      location: 'Central Park',
      category: 'Family',
      coordinates: { x: 30, y: 40 }
    },
    {
      id: '2',
      title: 'Science Museum Exhibition',
      location: 'City Science Museum',
      category: 'Indoor',
      coordinates: { x: 60, y: 25 }
    },
    {
      id: '3',
      title: 'Riverside Park Picnic',
      location: 'Riverside Park',
      category: 'Outdoor',
      coordinates: { x: 75, y: 60 }
    },
    {
      id: '4',
      title: 'Downtown Restaurant',
      location: 'Downtown Area',
      category: 'Food',
      coordinates: { x: 45, y: 70 }
    }
  ];

  // Mock itinerary data
  const itinerary: ItineraryDay[] = [
    {
      date: '2025-09-20',
      items: [
        {
          id: '1',
          title: 'Family Fun Day at Central Park',
          location: 'Central Park',
          time: '10:00 AM',
          duration: '3 hours',
          category: 'Family',
          notes: 'Bring snacks and water bottles'
        },
        {
          id: '2',
          title: 'Lunch at Family Restaurant',
          location: 'Downtown Area',
          time: '1:00 PM',
          duration: '1 hour',
          category: 'Food'
        },
        {
          id: '3',
          title: 'Shopping at Local Market',
          location: 'Main Street Market',
          time: '3:00 PM',
          duration: '2 hours',
          category: 'Shopping'
        }
      ]
    },
    {
      date: '2025-09-21',
      items: [
        {
          id: '4',
          title: 'Science Museum Exhibition',
          location: 'City Science Museum',
          time: '9:00 AM',
          duration: '4 hours',
          category: 'Indoor',
          notes: 'Interactive exhibits - kids will love it!'
        },
        {
          id: '5',
          title: 'Picnic in the Park',
          location: 'Riverside Park',
          time: '2:00 PM',
          duration: '2 hours',
          category: 'Outdoor'
        }
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Family': 'bg-blue-500',
      'Indoor': 'bg-purple-500',
      'Outdoor': 'bg-green-500',
      'Food': 'bg-orange-500',
      'Cultural': 'bg-pink-500',
      'Shopping': 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Family': '👨‍👩‍👧‍👦',
      'Indoor': '🏛️',
      'Outdoor': '🏞️',
      'Food': '🍽️',
      'Cultural': '🎭',
      'Shopping': '🛍️'
    };
    return icons[category as keyof typeof icons] || '📍';
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-2xl text-gray-900 font-semibold">Your Family Itinerary</h2>
        <p className="text-gray-600">
          Your personalized trip plan
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden border border-primary/20">
        {/* Mock map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="w-8 h-8 border border-gray-200"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Event markers */}
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className={`absolute w-6 h-6 rounded-full ${getCategoryColor(event.category)} 
              text-white flex items-center justify-center text-xs hover:scale-110 
              transition-transform shadow-lg border-2 border-white z-10`}
            style={{
              left: `${event.coordinates.x}%`,
              top: `${event.coordinates.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title={event.title}
          >
            {getCategoryIcon(event.category)}
          </button>
        ))}
        
        {/* Map legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Family</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Outdoor</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Indoor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Overview */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-green-700">🌟 New York City Adventure</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700">3 Days</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Sep 20-22, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>4 Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>New York City</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">$2,500 Budget</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">
                Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h3>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {day.items.map((item, itemIndex) => (
                <Card key={item.id} className="relative">
                  {/* Timeline connector */}
                  {itemIndex < day.items.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-border z-0"></div>
                  )}
                  
                  <CardContent className="p-4 relative z-10">
                    <div className="flex gap-4">
                      {/* Time indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${getCategoryColor(item.category)} 
                          text-white flex items-center justify-center text-xs`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 text-center">
                          {item.time}
                        </div>
                      </div>
                      
                      {/* Activity details */}
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <h4 className="leading-tight">{item.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                            Edit
                          </Button>
                        </div>
                        
                        {item.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                            <p className="text-xs text-yellow-800">{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Day Button */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6">
          <Button variant="ghost" className="w-full flex items-center gap-2 text-muted-foreground">
            <Plus className="w-5 h-5" />
            Add Another Day
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full h-12">
          Save Itinerary
        </Button>
        <Button variant="outline" className="w-full h-12">
          Share with Family
        </Button>
      </div>
    </div>
  );
}