
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [styleTemplate, setStyleTemplate] = useState('');
  const [sources, setSources] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddSource = () => {
    setSources([...sources, '']);
  };

  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...sources];
    newSources[index] = value;
    setSources(newSources);
  };

  const handleRemoveSource = (index: number) => {
    if (sources.length > 1) {
      const newSources = [...sources];
      newSources.splice(index, 1);
      setSources(newSources);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Bitte geben Sie einen Titel ein");
      return;
    }
    
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Blog-Artikel erstellt");
      navigate("/edit/blog/new-article-id");
      setIsCreating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto max-w-3xl">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-full">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Neuen Blog-Artikel erstellen</h1>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Titel
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Geben Sie einen aussagekräftigen Titel ein"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Thema/Beschreibung
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreiben Sie das Thema und die wichtigsten Punkte"
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="styleTemplate" className="block text-sm font-medium">
                  Stilvorlage (optional)
                </label>
                <Select value={styleTemplate} onValueChange={setStyleTemplate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wählen Sie eine Stilvorlage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informativ & Sachlich</SelectItem>
                    <SelectItem value="conversational">Konversationell & Persönlich</SelectItem>
                    <SelectItem value="persuasive">Überzeugend & Werbend</SelectItem>
                    <SelectItem value="storytelling">Erzählend & Narrativ</SelectItem>
                    <SelectItem value="technical">Technisch & Detailliert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Quellen (optional)
                </label>
                
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={source}
                        onChange={(e) => handleSourceChange(index, e.target.value)}
                        placeholder="URL oder Referenz eingeben"
                        className="flex-1"
                        prefix={<LinkIcon className="h-4 w-4 text-muted-foreground mr-2" />}
                      />
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveSource(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSource}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Quelle hinzufügen
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isCreating}
                >
                  {isCreating ? 'Wird erstellt...' : 'Erstellen'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateBlog;
