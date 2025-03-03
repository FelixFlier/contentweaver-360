
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Plus, Sparkles } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface StyleProfile {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onChange: (style: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onChange }) => {
  const navigate = useNavigate();
  const [styleProfiles, setStyleProfiles] = useState<StyleProfile[]>([
    { id: '1', name: 'Professionell', description: 'Formeller, geschäftlicher Ton mit klarer Struktur' },
    { id: '2', name: 'Conversational', description: 'Locker, persönlich und dialogorientiert' },
    { id: '3', name: 'Technisch', description: 'Präzise Fachsprache mit detaillierten Erklärungen' },
    { id: '4', name: 'Kreativ', description: 'Bildhaft, metaphernreich und inspirierend' },
  ]);

  const getStyleDescription = (id: string) => {
    const profile = styleProfiles.find(p => p.id === id);
    return profile ? profile.description : '';
  };

  const handleCreateStyle = () => {
    toast.info("Redirecting to Style Analysis...");
    navigate('/analysis');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="style-selector" className="text-sm font-medium text-foreground">
          Stilprofil
        </label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCreateStyle}
          className="text-xs flex items-center gap-1 text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Neu erstellen
        </Button>
      </div>
      
      <Select value={selectedStyle} onValueChange={onChange}>
        <SelectTrigger id="style-selector" className="w-full bg-card border-border">
          <SelectValue placeholder="Stilprofil auswählen" />
        </SelectTrigger>
        <SelectContent>
          {styleProfiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id} className="flex items-center py-2.5">
              <div className="flex flex-col">
                <span>{profile.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{profile.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedStyle && (
        <div className="bg-primary/5 border border-primary/10 rounded-md p-3 mt-3 animate-fade-in">
          <div className="flex gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">
                {styleProfiles.find(p => p.id === selectedStyle)?.name || 'Ausgewähltes Profil'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {getStyleDescription(selectedStyle)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleSelector;
