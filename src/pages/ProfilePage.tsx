
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Calendar, MapPin, Edit, Save, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, uploadAvatar } from '@/services/profileService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });
  
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setIsLoading(true);
        const userProfile = await getUserProfile();
        setIsLoading(false);
        
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            bio: userProfile.bio || '',
            location: userProfile.location || '',
          });
        }
      }
    };
    
    loadProfile();
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    const updated = await updateUserProfile(formData);
    setIsLoading(false);
    
    if (updated) {
      setProfile(updated);
      setIsEditing(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Datei zu groß",
          description: "Die maximale Dateigröße beträgt 5 MB",
          variant: "destructive"
        });
        return;
      }
      
      setIsLoading(true);
      const avatarUrl = await uploadAvatar(file);
      
      if (avatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      }
      
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-16 mx-auto">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-xl text-center">Anmeldung erforderlich</CardTitle>
                <CardDescription className="text-center">
                  Sie müssen angemeldet sein, um auf diese Seite zuzugreifen.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold">Mein Profil</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="hover-lift">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || user.email} />
                      <AvatarFallback className="text-3xl">
                        {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="bg-primary text-white p-1.5 rounded-full">
                            <Image className="h-4 w-4" />
                          </div>
                          <Input 
                            type="file" 
                            id="avatar-upload" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarChange}
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold">{profile?.name || user.email}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{profile?.bio || 'Kein Profil-Bio vorhanden'}</p>
                  
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile?.email || user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile?.location || 'Keine Ortsangabe'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Mitglied seit {profile?.joined_date 
                        ? new Date(profile.joined_date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) 
                        : 'Unbekannt'}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full" 
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Bearbeitung abbrechen
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Profil bearbeiten
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="account">Konto</TabsTrigger>
                <TabsTrigger value="security">Sicherheit</TabsTrigger>
                <TabsTrigger value="preferences">Einstellungen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Kontoinformationen</CardTitle>
                    <CardDescription>
                      Aktualisieren Sie Ihre Profildaten
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Ihr Name" 
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail-Adresse</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="ihre-email@beispiel.de" 
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografie</Label>
                      <Input 
                        id="bio" 
                        name="bio"
                        placeholder="Erzählen Sie etwas über sich" 
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Standort</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="Ihr Standort" 
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSave} 
                      disabled={!isEditing || isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? (
                        <>Wird gespeichert...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Speichern
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sicherheit</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihr Passwort und die Sicherheitseinstellungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Aktuelles Passwort</Label>
                      <Input id="current-password" type="password" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Neues Passwort</Label>
                      <Input id="new-password" type="password" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                      <Input id="confirm-password" type="password" disabled={!isEditing} />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Zwei-Faktor-Authentifizierung</h3>
                      <p className="text-sm text-muted-foreground">
                        Erhöhen Sie die Sicherheit Ihres Kontos mit der Zwei-Faktor-Authentifizierung.
                      </p>
                      <Button variant="outline" disabled className="mt-2">
                        2FA aktivieren
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      Abmelden
                    </Button>
                    
                    <Button 
                      onClick={handleSave} 
                      disabled={!isEditing || isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Benutzereinstellungen</CardTitle>
                    <CardDescription>
                      Passen Sie die Anwendung an Ihre Bedürfnisse an
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Benachrichtigungen</h3>
                      <p className="text-sm text-muted-foreground">
                        Verwalten Sie Ihre Benachrichtigungseinstellungen
                      </p>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <Button variant="outline" className="justify-start" disabled>
                          E-Mail-Benachrichtigungen
                        </Button>
                        <Button variant="outline" className="justify-start" disabled>
                          Push-Benachrichtigungen
                        </Button>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Datenschutz</h3>
                      <p className="text-sm text-muted-foreground">
                        Verwalten Sie Ihre Datenschutzeinstellungen
                      </p>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <Button variant="outline" className="justify-start" disabled>
                          Datenschutzeinstellungen
                        </Button>
                        <Button variant="outline" className="justify-start" disabled>
                          Datenexport
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
