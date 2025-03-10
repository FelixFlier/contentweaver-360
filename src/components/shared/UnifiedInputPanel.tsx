// src/components/shared/UnifiedInputPanel.tsx
import React, { useState } from 'react';
import { FileUp, Link, Type } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UnifiedInputPanelProps {
  onSubmit: (data: { type: 'text' | 'link' | 'file'; content: string | File }) => void;
  placeholder?: string;
  allowedFileTypes?: string[];
  submitButtonText?: string;
}

const UnifiedInputPanel: React.FC<UnifiedInputPanelProps> = ({
  onSubmit,
  placeholder = 'Fügen Sie hier Ihren Text ein...',
  allowedFileTypes = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.xlsx', '.xls'],
  submitButtonText = 'Absenden'
}) => {
  const [activeTab, setActiveTab] = useState<string>('text');
  const [textContent, setTextContent] = useState('');
  const [linkContent, setLinkContent] = useState('');
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    try {
      switch (activeTab) {
        case 'text':
          if (!textContent.trim()) {
            toast.error('Bitte geben Sie einen Text ein');
            return;
          }
          onSubmit({ type: 'text', content: textContent });
          setTextContent('');
          break;
          
        case 'link':
          if (!linkContent.trim()) {
            toast.error('Bitte geben Sie einen Link ein');
            return;
          }
          
          // Basic URL validation
          try {
            new URL(linkContent);
            onSubmit({ type: 'link', content: linkContent });
            setLinkContent('');
          } catch (e) {
            toast.error('Bitte geben Sie eine gültige URL ein');
            return;
          }
          break;
          
        case 'file':
          if (!fileContent) {
            toast.error('Bitte wählen Sie eine Datei aus');
            return;
          }
          onSubmit({ type: 'file', content: fileContent });
          setFileContent(null);
          break;
      }
    } catch (error) {
      console.error('Error submitting content:', error);
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Die Datei ist zu groß. Maximale Größe: 5MB');
        return;
      }
      
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && !allowedFileTypes.includes(`.${fileExtension}`)) {
        toast.error(`Dieser Dateityp wird nicht unterstützt. Erlaubte Typen: ${allowedFileTypes.join(', ')}`);
        return;
      }
      
      setFileContent(file);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border/40 overflow-hidden shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-border/30 w-full rounded-none justify-start">
          <TabsTrigger value="text" className="flex items-center gap-1.5">
            <Type className="h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-1.5">
            <Link className="h-4 w-4" />
            Link
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-1.5">
            <FileUp className="h-4 w-4" />
            Datei
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="p-4">
          <Textarea
            placeholder={placeholder}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-40 mb-4"
          />
          <Button onClick={handleSubmit} disabled={isSubmitting || !textContent.trim()}>
            {isSubmitting ? 'Wird verarbeitet...' : submitButtonText}
          </Button>
        </TabsContent>
        
        <TabsContent value="link" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-input">URL eingeben</Label>
              <Input
                id="link-input"
                placeholder="https://beispiel.com/artikel"
                value={linkContent}
                onChange={(e) => setLinkContent(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting || !linkContent.trim()}>
              {isSubmitting ? 'Wird verarbeitet...' : submitButtonText}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="file" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">Datei hochladen</Label>
              <div className="flex gap-2">
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept={allowedFileTypes.join(',')}
                />
              </div>
              {fileContent && (
                <p className="text-sm text-muted-foreground">
                  Ausgewählte Datei: {fileContent.name} ({(fileContent.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting || !fileContent}>
              {isSubmitting ? 'Wird verarbeitet...' : submitButtonText}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedInputPanel;
