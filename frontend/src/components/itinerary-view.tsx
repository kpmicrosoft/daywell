import { useState, useCallback, useEffect } from 'react';
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

interface EventItem {
  id: string;
  title: string;
  location: string;
  category: string;
  coordinates?: { lat: number; lng: number };
}

interface PredictHQEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  category: string;
  labels: string[];
  location: string[];
  description?: string;
  local_rank: number;
}

interface ItineraryDay {
  date: string;
  items: ItineraryItem[];
}

const libraries: ("places" | "marker")[] = ["places", "marker"];

const mapContainerStyleExpanded = {
  width: '100%',
  height: '300px' // Rectangular shape - wider than tall
};

const getMapCenter = (itineraryData: any) => {
  // Try to get center from first activity with coordinates
  const firstActivity = itineraryData?.trip?.itinerary?.[0]?.activities?.[0];
  if (firstActivity?.coordinates) {
    return firstActivity.coordinates;
  }
  // Fallback to NYC coordinates
  return { lat: 40.7829, lng: -73.9654 };
};

interface ItineraryViewProps {
  itineraryData?: any;
}

export function ItineraryView({ itineraryData }: ItineraryViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isEventsExpanded, setIsEventsExpanded] = useState(false);
  const [apiEvents, setApiEvents] = useState<PredictHQEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Extract coordinates, start date, and end date from itinerary data
  const getApiParameters = () => {
    if (!itineraryData?.trip) {
      // Fallback to NYC coordinates and default dates
      return {
        coordinates: '40.7437,-74.0288',
        startDate: '2025-09-20',
        endDate: '2025-09-27'
      };
    }

    // Get coordinates from trip level, fallback to first activity if not available
    let coordinates = '40.7437,-74.0288'; // Default NYC coordinates
    if (itineraryData.trip.coordinates) {
      const { lat, lng } = itineraryData.trip.coordinates;
      coordinates = `${lat},${lng}`;
    } else if (itineraryData.trip.itinerary?.[0]?.activities?.[0]?.coordinates) {
      // Fallback to first activity coordinates if trip coordinates not available
      const { lat, lng } = itineraryData.trip.itinerary[0].activities[0].coordinates;
      coordinates = `${lat},${lng}`;
    }

    // Get start date and end date from trip level, fallback to itinerary dates
    let startDate = '2025-09-20';
    let endDate = '2025-09-27';
    
    if (itineraryData.trip.startDate) {
      startDate = itineraryData.trip.startDate;
    } else if (itineraryData.trip.itinerary?.[0]?.date) {
      startDate = itineraryData.trip.itinerary[0].date;
    }
    
    if (itineraryData.trip.endDate) {
      endDate = itineraryData.trip.endDate;
    } else if (itineraryData.trip.itinerary?.length > 0) {
      endDate = itineraryData.trip.itinerary[itineraryData.trip.itinerary.length - 1].date;
    }

    return { coordinates, startDate, endDate };
  };

  // Fetch events from PredictHQ API
  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    
    try {
      const apiKey = "VXd6jVUcGedyL397rDKPLDFbFfHyFFCXQw8nI61q"; //import.meta.env.VITE_PREDICTHQ_API_KEY;";
      if (!apiKey) {
        throw new Error('PredictHQ API key not found in environment variables');
      }

      const { coordinates, startDate, endDate } = getApiParameters();

      const response = await fetch(
        `https://api.predicthq.com/v1/events/?within=5mi@${coordinates}&active.gte=${startDate}&active.lte=${endDate}&category=community,festivals&sort=-rank&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': '*/*'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setApiEvents(data.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventsError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch events when component mounts or itinerary data changes
  useEffect(() => {
    fetchEvents();
  }, [itineraryData]);

  // Show loading state if no itinerary data is available
  if (!itineraryData) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Itinerary Available</h2>
          <p className="text-gray-500">Please create a trip plan first.</p>
        </div>
      </div>
    );
  }

  // Transform API response data into events for the map
  const events = itineraryData?.trip?.itinerary?.flatMap((day: any) =>
    day.activities?.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      location: activity.address || 'Location not specified',
      category: activity.type === 'meal' ? 'Food' : 
               activity.tags?.includes('indoor') ? 'Indoor' :
               activity.tags?.includes('outdoor') ? 'Outdoor' :
               activity.tags?.includes('family') ? 'Family' : 'Activity',
      coordinates: activity.coordinates
    })) || []
  ) || [];

  // Transform API response data into itinerary format
  const itinerary: ItineraryDay[] = itineraryData?.trip?.itinerary?.map((day: any) => ({
    date: day.date,
    items: day.activities?.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      location: activity.address || 'Location not specified',
      time: activity.sequenced_time?.start || 'Time TBD',
      duration: activity.estimated_duration || 'Duration not specified',
      category: activity.type === 'meal' ? 'Food' : 
               activity.tags?.includes('indoor') ? 'Indoor' :
               activity.tags?.includes('outdoor') ? 'Outdoor' :
               activity.tags?.includes('family') ? 'Family' : 'Activity',
      notes: activity.description
    })) || []
  })) || [];

  // Get map center from itinerary data
  const center = getMapCenter(itineraryData);

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
      const newMarkers = events.map((event: EventItem) => {
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
              ${event.coordinates ? `
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">
                  Coordinates: ${event.coordinates.lat}, ${event.coordinates.lng}
                </p>
              ` : ''}
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
      <div className="text-center space-y-3 text-card-foreground">
        <p>
          Plan Your Family Trip
        </p>
      </div>

      {/* Interactive Google Map - Foldable */}
      <Card className="rounded-xl overflow-hidden" style={{ borderColor: '#118B97', borderWidth: '0.2px', borderStyle: 'solid' }}>        
        <CardContent className="p-0" style={{ paddingBottom: 0 }}>
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden h-80 rounded-xl pb-0">
              {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
                  <p className="text-gray-600 text-center mb-4">Map could not load</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Fallback - Event Locations:</p>
                    {events.map((event: EventItem) => (
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
            </div>
        </CardContent>
      </Card>

      {/* Events List - Foldable */}
      <Card className="border border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Events {!isEventsExpanded && '(Click to view)'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEventsExpanded(!isEventsExpanded)}
              className="h-8 w-8 p-0"
            >
              {isEventsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isEventsExpanded && (
            <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden max-h-96 overflow-y-auto">
              {eventsLoading && (
                <div className="p-4 text-center">
                  <p className="text-gray-600">Loading events...</p>
                </div>
              )}
              
              {eventsError && (
                <div className="p-4 text-center">
                  <p className="text-red-600 mb-2">Error loading events</p>
                  <p className="text-xs text-gray-500">{eventsError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchEvents}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}
              
              {!eventsLoading && !eventsError && apiEvents.length > 0 && (
                <div className="p-4 space-y-3">
                  <div className="font-medium text-gray-700 mb-3">
                    Upcoming Events ({apiEvents.length})
                  </div>
                  <div className="space-y-2">
                    {apiEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-white shadow-sm border border-gray-100">
                        <div className="flex-shrink-0">
                          <span className="text-lg">
                            {event.category === 'festivals' ? '🎉' : 
                             event.category === 'community' ? '👥' : '📅'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm leading-tight mb-1">
                            {event.title}
                          </div>
                          {event.location && event.location.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location.join(', ')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(event.start).toLocaleDateString()}</span>
                            {event.end && event.start !== event.end && (
                              <span> - {new Date(event.end).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {event.category}
                            </Badge>
                            {event.local_rank && (
                              <span className="text-xs text-gray-400">
                                Rank: {event.local_rank}
                              </span>
                            )}
                          </div>
                          {event.labels && event.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {event.labels.slice(0, 3).map((label, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {label}
                                </span>
                              ))}
                              {event.labels.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{event.labels.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!eventsLoading && !eventsError && apiEvents.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-gray-600">No events found for the selected dates</p>
                </div>
              )}
              
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
              <h3 className="text-lg text-green-700">{itineraryData?.trip?.destination || "Your Family Adventure"}</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700">{itineraryData?.trip?.duration || "Multi-day"}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{itineraryData?.trip?.itinerary?.[0]?.date && itineraryData?.trip?.itinerary?.[itineraryData.trip.itinerary.length - 1]?.date 
                  ? `${new Date(itineraryData.trip.itinerary[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(itineraryData.trip.itinerary[itineraryData.trip.itinerary.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : "Date TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{itineraryData?.trip?.family_members?.length || 0} Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{itineraryData?.trip?.destination?.split(',')[0] || "Destination"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">{itineraryData?.trip?.itinerary?.length || 0} Days Planned</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="">
        {itinerary.map((day, dayIndex) => (
          <Card key={dayIndex} className="border border-gray-200 gap-0">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between text-semibold">
                <CardTitle className="text-lg underline" style={{ color: '#03438C', fontWeight: 'bold' }}>
                  Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {day.items.map((item, itemIndex) => (
                <div key={item.id} className="relative bg-gray-50/50 rounded-lg">
                  <div className="p-4 relative z-10">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <h4 className="leading-tight" style={{ color: '#000000', fontWeight: 'bold' }}>{item.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                          <p className="text-xs text-yellow-800">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

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