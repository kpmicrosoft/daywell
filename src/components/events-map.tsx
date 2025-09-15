import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, Clock, Users, Star } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
  rating: number;
  attendees: number;
  image: string;
  coordinates: { x: number; y: number };
}

export function EventsMap() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Family Fun Day at Central Park',
      description: 'Outdoor activities, games, and entertainment for the whole family',
      location: 'Central Park',
      date: '2025-09-20',
      time: '10:00 AM',
      category: 'Family',
      price: 'Free',
      rating: 4.8,
      attendees: 250,
      image: '/api/placeholder/300/200',
      coordinates: { x: 30, y: 40 }
    },
    {
      id: '2',
      title: 'Science Museum Exhibition',
      description: 'Interactive exhibits perfect for curious minds',
      location: 'City Science Museum',
      date: '2025-09-21',
      time: '9:00 AM',
      category: 'Indoor',
      price: '$15',
      rating: 4.6,
      attendees: 180,
      image: '/api/placeholder/300/200',
      coordinates: { x: 60, y: 25 }
    },
    {
      id: '3',
      title: 'Adventure Hiking Trail',
      description: 'Scenic hiking trail with amazing views',
      location: 'Mountain Ridge Trail',
      date: '2025-09-22',
      time: '7:00 AM',
      category: 'Outdoor',
      price: '$5',
      rating: 4.9,
      attendees: 120,
      image: '/api/placeholder/300/200',
      coordinates: { x: 75, y: 60 }
    },
    {
      id: '4',
      title: 'Local Food Festival',
      description: 'Taste local delicacies and family-friendly dining',
      location: 'Downtown Square',
      date: '2025-09-23',
      time: '12:00 PM',
      category: 'Food',
      price: '$20',
      rating: 4.7,
      attendees: 500,
      image: '/api/placeholder/300/200',
      coordinates: { x: 45, y: 70 }
    },
    {
      id: '5',
      title: 'Art Gallery Workshop',
      description: 'Creative workshop for families and kids',
      location: 'Modern Art Gallery',
      date: '2025-09-24',
      time: '2:00 PM',
      category: 'Cultural',
      price: '$12',
      rating: 4.5,
      attendees: 80,
      image: '/api/placeholder/300/200',
      coordinates: { x: 20, y: 30 }
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Family': 'bg-blue-500',
      'Indoor': 'bg-purple-500',
      'Outdoor': 'bg-green-500',
      'Food': 'bg-orange-500',
      'Cultural': 'bg-pink-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Family': '👨‍👩‍👧‍👦',
      'Indoor': '🏛️',
      'Outdoor': '🏞️',
      'Food': '🍽️',
      'Cultural': '🎭'
    };
    return icons[category as keyof typeof icons] || '📍';
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">Local Events & Activities</h2>
        <p className="text-muted-foreground">
          Discover family-friendly events happening nearby
        </p>
      </div>

      {/* Map Container */}
      <Card className="relative">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Event Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
            {/* Mock map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex">
                    {Array.from({ length: 10 }).map((_, j) => (
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
                className={`absolute w-8 h-8 rounded-full ${getCategoryColor(event.category)} 
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
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Family</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Outdoor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Indoor</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg leading-tight">{selectedEvent.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryIcon(selectedEvent.category)} {selectedEvent.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedEvent.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{selectedEvent.attendees} attending</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-lg text-primary">{selectedEvent.price}</span>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
              <Button className="px-6">
                Add to Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event List */}
      <div className="space-y-3">
        <h3 className="text-lg">Upcoming Events</h3>
        {events.slice(0, 3).map((event) => (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedEvent(event)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCategoryIcon(event.category)}</span>
                    <h4 className="text-sm leading-tight">{event.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.time}</span>
                    <span>{event.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{event.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}