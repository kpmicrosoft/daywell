import { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Clock, Users, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  notes?: string;
  coordinates?: { lat: number; lng: number };
}

interface ItineraryDay {
  date: string;
  items: ItineraryItem[];
}

const libraries: ("places" | "marker")[] = ["places", "marker"];

const mapContainerStyleExpanded = {
  width: '100%',
  height: '400px' // Larger when expanded for detailed viewing
};

const center = {
  lat: 40.7829, // Central Park coordinates
  lng: -73.9654
};

export function ItineraryView() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Mock events data for map with real NYC coordinates
  const events = [
    {
      id: '1',
      title: 'Family Fun Day at Central Park',
      location: 'Central Park',
      category: 'Family',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    {
      id: '2',
      title: 'Science Museum Exhibition',
      location: 'City Science Museum',
      category: 'Indoor',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    {
      id: '3',
      title: 'Riverside Park Picnic',
      location: 'Riverside Park',
      category: 'Outdoor',
      coordinates: { lat: 40.7956, lng: -73.9721 }
    },
    {
      id: '4',
      title: 'Downtown Restaurant',
      location: 'Downtown Area',
      category: 'Food',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    {
      id: '5',
      title: 'Times Square Experience',
      location: 'Times Square',
      category: 'Cultural',
      coordinates: { lat: 40.7580, lng: -73.9855 }
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

  const getCategoryMapColor = (category: string) => {
    const colors = {
      'Family': '#3b82f6',
      'Indoor': '#a855f7',
      'Outdoor': '#22c55e',
      'Food': '#f97316',
      'Cultural': '#ec4899',
      'Shopping': '#eab308'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  // Handle map load and create markers using modern API
  const onMapLoad = useCallback(async (map: google.maps.Map) => {
    setMap(map);
    
    try {
      // Import the marker library
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      
      // Create info window
      const infoWindowInstance = new google.maps.InfoWindow();
      setInfoWindow(infoWindowInstance);
      
      // Create markers for each event
      const newMarkers = events.map((event) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: event.coordinates,
          title: event.title,
        });
        
        // Add click listener
        marker.addListener('click', () => {
          setSelectedMarker(event.id);
          infoWindowInstance.setContent(`
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${event.title}</h4>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${event.location}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">
                Coordinates: ${event.coordinates.lat}, ${event.coordinates.lng}
              </p>
              <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                ${event.category}
              </span>
            </div>
          `);
          infoWindowInstance.open(map, marker);
        });
        
        return marker;
      });
      
      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  }, [events]);

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

      {/* Interactive Google Map - Foldable */}
      <Card className="border border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              Trip Map {!isMapExpanded && '(Click to view)'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="h-8 w-8 p-0"
            >
              {isMapExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isMapExpanded && (
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden h-96">
              {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
                  <p className="text-gray-600 text-center mb-4">Map could not load</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Fallback - Event Locations:</p>
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getCategoryMapColor(event.category) }}
                        ></div>
                        <span>{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600">Loading map...</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'API Key found' : 'No API Key - using fallback'}
                    </p>
                  </div>
                </div>
              )}
              
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyleExpanded}
                  zoom={12}
                  center={center}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    mapId: 'daywell-trip-map', // Required for AdvancedMarkerElement
                  }}
                >
                  {/* Markers are now handled in onMapLoad with AdvancedMarkerElement */}
                </GoogleMap>
              )}
              
              {/* Map legend */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg">
                <div className="space-y-2">
                  <div className="font-medium text-gray-700 mb-2">
                    Categories ({events.length} locations)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Family</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Outdoor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Indoor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Food</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span>Cultural</span>
                  </div>
                </div>
              </div>
              
              {/* Collapse hint */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-lg">
                Tap to collapse
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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