
import React from 'react';
import { ArrowLeft, User, Mail, Lock, Calendar, MapPin, Edit, Save } from 'lucide-react';
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Get user data from localStorage
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const [formData, setFormData] = React.useState({
    name: userData?.name || '',
    email: userData?.email || '',
    bio: 'Content Creator & Marketing Specialist',
    location: 'Berlin, Deutschland',
    joined: 'Januar 2023'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    if (userData) {
      const updatedUserData = { ...userData, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profiländerungen wurden gespeichert.",
      });
    }
    setIsEditing(false);
  };
  
  if (!isLoggedIn) {
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
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt={userData?.name} />
                    <AvatarFallback className="text-3xl">
                      {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold">{userData?.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{formData.bio}</p>
                  
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{userData?.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Mitglied seit {formData.joined}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full" 
                    onClick={() => setIsEditing(!isEditing)}
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
                        disabled={!isEditing}
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
                        disabled={!isEditing}
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
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSave} 
                      disabled={!isEditing}
                      className="ml-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
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
                  <CardFooter>
                    <Button 
                      onClick={handleSave} 
                      disabled={!isEditing}
                      className="ml-auto"
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
