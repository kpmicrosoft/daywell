import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Calendar, Heart, Settings, LogOut, Plane, Plus, Edit, AlertTriangle } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  age: string;
  relationship: string;
  allergies: string;
  disabilities: string;
  interests: string[];
}

export function ProfileView() {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Mike Johnson',
      age: '45',
      relationship: 'spouse',
      allergies: 'None',
      disabilities: 'None',
      interests: ['Photography', 'History', 'Food']
    },
    {
      id: '2',
      name: 'Emma Johnson',
      age: '12',
      relationship: 'child',
      allergies: 'Peanuts',
      disabilities: 'None',
      interests: ['Animals', 'Art', 'Swimming']
    },
    {
      id: '3',
      name: 'Jack Johnson',
      age: '8',
      relationship: 'child',
      allergies: 'None',
      disabilities: 'Autism spectrum',
      interests: ['Dinosaurs', 'Building blocks', 'Music']
    }
  ]);

  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    age: '',
    relationship: '',
    allergies: '',
    disabilities: '',
    interests: []
  });

  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    initials: 'SJ',
    totalTrips: 12,
    upcomingTrips: 2,
    favoriteDestinations: ['Paris 🇫🇷', 'Tokyo 🇯🇵', 'New York 🇺🇸'],
    familyMembers: familyMembers.length + 1 // +1 for the user
  };

  const recentTrips = [
    {
      id: '1',
      destination: 'San Francisco',
      date: 'Aug 2025',
      duration: '5 days',
      status: 'completed',
      rating: 5
    },
    {
      id: '2',
      destination: 'Orlando',
      date: 'Jul 2025',
      duration: '7 days',
      status: 'completed',
      rating: 4
    },
    {
      id: '3',
      destination: 'New York City',
      date: 'Sep 2025',
      duration: '3 days',
      status: 'upcoming',
      rating: null
    }
  ];

  const handleAddMember = () => {
    if (newMember.name && newMember.age && newMember.relationship) {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name: newMember.name || '',
        age: newMember.age || '',
        relationship: newMember.relationship || '',
        allergies: newMember.allergies || 'None',
        disabilities: newMember.disabilities || 'None',
        interests: newMember.interests || []
      };
      setFamilyMembers([...familyMembers, member]);
      setNewMember({
        name: '',
        age: '',
        relationship: '',
        allergies: '',
        disabilities: '',
        interests: []
      });
      setIsAddingMember(false);
    }
  };

  const getRelationshipEmoji = (relationship: string) => {
    switch (relationship) {
      case 'spouse': return '💑';
      case 'child': return '👶';
      case 'parent': return '👴';
      case 'sibling': return '👫';
      default: return '👤';
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-20">
      {/* Profile Header */}
      <Card className="border border-primary/20 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-sm">
              <AvatarFallback className="text-lg bg-primary text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl text-gray-900 font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Family of {user.familyMembers}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Statistics */}
      <Card className="border border-primary/20 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            Trip Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1 bg-gray-50 rounded-lg p-3">
              <div className="text-3xl text-primary font-semibold">{user.totalTrips}</div>
              <p className="text-sm text-gray-600">Total Trips</p>
            </div>
            <div className="text-center space-y-1 bg-gray-50 rounded-lg p-3">
              <div className="text-3xl text-primary font-semibold">{user.upcomingTrips}</div>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-900 font-medium">Favorite Destinations</p>
            <div className="flex flex-wrap gap-2">
              {user.favoriteDestinations.map((destination) => (
                <Badge key={destination} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {destination}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card className="border border-primary/20 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Recent Trips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <h4 className="text-sm">{trip.destination}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{trip.date}</span>
                  <span>{trip.duration}</span>
                  {trip.rating && <span>{getRatingStars(trip.rating)}</span>}
                </div>
              </div>
              <Badge 
                variant={trip.status === 'upcoming' ? 'default' : 'secondary'}
                className={`text-xs ${trip.status === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {trip.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Family Members */}
      <Card className="border border-primary/20 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Family Members
            </div>
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newMember.name || ''}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      value={newMember.age || ''}
                      onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                      placeholder="Enter age"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <Select value={newMember.relationship || ''} onValueChange={(value: any) => setNewMember({ ...newMember, relationship: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Allergies</Label>
                    <Textarea
                      value={newMember.allergies || ''}
                      onChange={(e) => setNewMember({ ...newMember, allergies: e.target.value })}
                      placeholder="Any allergies or dietary restrictions"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Disabilities/Special Needs</Label>
                    <Textarea
                      value={newMember.disabilities || ''}
                      onChange={(e) => setNewMember({ ...newMember, disabilities: e.target.value })}
                      placeholder="Any accessibility requirements or special needs"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddMember} className="w-full">
                    Add Member ✨
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {familyMembers.map((member) => (
            <div key={member.id} className="p-3 bg-white/60 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getRelationshipEmoji(member.relationship)}</span>
                  <div>
                    <h4 className="text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {member.age} years old • {member.relationship}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              
              {(member.allergies !== 'None' || member.disabilities !== 'None') && (
                <div className="space-y-1">
                  {member.allergies !== 'None' && (
                    <div className="flex items-center gap-1 text-xs">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-red-600">Allergies: {member.allergies}</span>
                    </div>
                  )}
                  {member.disabilities !== 'None' && (
                    <div className="flex items-center gap-1 text-xs">
                      <Heart className="w-3 h-3 text-blue-500" />
                      <span className="text-blue-600">Special needs: {member.disabilities}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings & Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start h-12 border-2 border-gray-200 hover:border-blue-300">
          <Settings className="w-5 h-5 mr-3" />
          Settings ⚙️
        </Button>
        
        <Button variant="outline" className="w-full justify-start h-12 border-2 border-gray-200 hover:border-green-300">
          <Heart className="w-5 h-5 mr-3" />
          Travel Preferences 💚
        </Button>
        
        <Button variant="ghost" className="w-full justify-start h-12 text-destructive hover:bg-red-50">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out 👋
        </Button>
      </div>
    </div>
  );
}

// Users icon component
function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}