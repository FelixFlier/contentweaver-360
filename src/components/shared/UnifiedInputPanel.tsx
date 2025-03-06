
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Link, Upload } from 'lucide-react';

interface UnifiedInputPanelProps {
  onSubmit: (data: { type: 'text' | 'link' | 'file'; content: string | File }) => void;
  placeholder?: string;
}

const UnifiedInputPanel = ({ onSubmit, placeholder = "Fügen Sie hier Ihren Text ein..." }: UnifiedInputPanelProps) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleTextSubmit = () => {
    if (text.trim()) {
      onSubmit({ type: 'text', content: text });
      setPreview(text.substring(0, 100) + '...');
    }
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onSubmit({ type: 'link', content: url });
      setPreview(`Link: ${url}`);
    }
  };

  const handleFileSubmit = (file: File) => {
    onSubmit({ type: 'file', content: file });
    setPreview(`Datei: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      handleFileSubmit(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="w-full shadow-card animate-fade-in bg-card dark:bg-[#1E1E1E]">
      <CardContent className="p-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text eingeben
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link einfügen
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Datei hochladen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-0">
            <Textarea
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <Button onClick={handleTextSubmit} className="w-full">Analysieren</Button>
          </TabsContent>

          <TabsContent value="link" className="mt-0">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleUrlSubmit} className="w-full">Link analysieren</Button>
          </TabsContent>

          <TabsContent value="file" className="mt-0">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer mb-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Datei hier ablegen oder klicken zum Auswählen
              </p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                    handleFileSubmit(file);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => {
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.click();
              }}
              className="w-full"
            >
              Datei auswählen
            </Button>
          </TabsContent>
        </Tabs>

        {preview && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Vorschau:</p>
            <p className="mt-1">{preview}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedInputPanel;
