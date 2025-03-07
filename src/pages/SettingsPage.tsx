
import React from 'react';
import { ArrowLeft, Monitor, Moon, Sun, BellRing, Globe, Shield, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const SettingsPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleSave = (section: string) => {
    toast.success(`${section}-Einstellungen wurden gespeichert`);
  };
  
  const handleReset = () => {
    toast.info('Einstellungen wurden zurückgesetzt');
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
          <h1 className="text-2xl font-bold">Einstellungen</h1>
        </div>
        
        <Tabs defaultValue="appearance" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 space-y-4">
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Monitor className="h-4 w-4 mr-2" />
                  Erscheinungsbild
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  <BellRing className="h-4 w-4 mr-2" />
                  Benachrichtigungen
                </TabsTrigger>
                <TabsTrigger value="language" className="justify-start w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Sprache & Region
                </TabsTrigger>
                <TabsTrigger value="privacy" className="justify-start w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Datenschutz
                </TabsTrigger>
                <TabsTrigger value="account" className="justify-start w-full">
                  <Trash className="h-4 w-4 mr-2" />
                  Konto
                </TabsTrigger>
              </TabsList>
              
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">Benötigen Sie Hilfe?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Haben Sie Fragen zu den Einstellungen oder benötigen Sie Unterstützung?
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Support kontaktieren
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <TabsContent value="appearance" className="mt-0">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Erscheinungsbild</CardTitle>
                    <CardDescription>
                      Passen Sie an, wie ContentWeaver aussieht
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Farbschema</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <Label htmlFor="theme-toggle">Motiv</Label>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Text & Anzeige</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="font-size">Schriftgröße</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Medium" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Klein</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Groß</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="contrast">Hoher Kontrast</Label>
                          <Switch id="contrast" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="animations">Animationen</Label>
                          <Switch id="animations" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>Zurücksetzen</Button>
                    <Button onClick={() => handleSave('Erscheinungsbild')}>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Benachrichtigungen</CardTitle>
                    <CardDescription>
                      Legen Sie fest, wie Sie benachrichtigt werden möchten
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">E-Mail-Benachrichtigungen</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-content">Neue Inhalte</Label>
                          <Switch id="email-content" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-feedback">Feedback & Kommentare</Label>
                          <Switch id="email-feedback" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-system">Systemupdates</Label>
                          <Switch id="email-system" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Push-Benachrichtigungen</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-content">Neue Inhalte</Label>
                          <Switch id="push-content" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-feedback">Feedback & Kommentare</Label>
                          <Switch id="push-feedback" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-system">Systemupdates</Label>
                          <Switch id="push-system" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>Zurücksetzen</Button>
                    <Button onClick={() => handleSave('Benachrichtigungen')}>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="language" className="mt-0">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Sprache & Region</CardTitle>
                    <CardDescription>
                      Stellen Sie Ihre bevorzugte Sprache und regionale Einstellungen ein
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Sprache</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="interface-language">Oberfläche</Label>
                          <Select defaultValue="de">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Deutsch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="en">Englisch</SelectItem>
                              <SelectItem value="fr">Französisch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="content-language">Inhalte</Label>
                          <Select defaultValue="de">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Deutsch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="en">Englisch</SelectItem>
                              <SelectItem value="fr">Französisch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Region & Format</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="region">Region</Label>
                          <Select defaultValue="de">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Deutschland" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="de">Deutschland</SelectItem>
                              <SelectItem value="at">Österreich</SelectItem>
                              <SelectItem value="ch">Schweiz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="date-format">Datumsformat</Label>
                          <Select defaultValue="dmy">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="TT.MM.JJJJ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dmy">TT.MM.JJJJ</SelectItem>
                              <SelectItem value="mdy">MM/TT/JJJJ</SelectItem>
                              <SelectItem value="ymd">JJJJ-MM-TT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>Zurücksetzen</Button>
                    <Button onClick={() => handleSave('Sprache')}>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-0">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Datenschutz</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Datenschutzeinstellungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Datenschutzeinstellungen</h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="cookies">Cookies</Label>
                            <p className="text-xs text-muted-foreground">Notwendige Cookies werden immer verwendet</p>
                          </div>
                          <Switch id="cookies" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="analytics">Analyse</Label>
                            <p className="text-xs text-muted-foreground">Verbessert die App durch anonyme Nutzungsdaten</p>
                          </div>
                          <Switch id="analytics" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="personalization">Personalisierung</Label>
                            <p className="text-xs text-muted-foreground">Personalisierter Inhalt basierend auf Ihren Vorlieben</p>
                          </div>
                          <Switch id="personalization" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Datenzugriff & Speicherung</h3>
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          Meine Daten einsehen
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Globe className="h-4 w-4 mr-2" />
                          Datenexport anfordern
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>Zurücksetzen</Button>
                    <Button onClick={() => handleSave('Datenschutz')}>Speichern</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="mt-0">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Konto</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Kontodaten und -einstellungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Konto verwalten</h3>
                      
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
                          Zum Profil
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Passwort ändern
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-destructive">Gefahrenzone</h3>
                      <p className="text-sm text-muted-foreground">
                        Diese Aktionen können nicht rückgängig gemacht werden
                      </p>
                      
                      <div className="flex flex-col gap-3 pt-2">
                        <Button variant="outline" className="border-destructive text-destructive justify-start hover:bg-destructive/10">
                          Alle Daten löschen
                        </Button>
                        <Button variant="destructive" className="justify-start">
                          <Trash className="h-4 w-4 mr-2" />
                          Konto löschen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
