
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, ArrowRight } from 'lucide-react';
import ContentCard from '@/components/content/ContentCard';
import { Button } from '@/components/ui/button';

const ContentList = () => {
  const navigate = useNavigate();
  
  // Mock content data
  const recentContents = [
    {
      id: '1',
      title: 'Die Zukunft der KI im digitalen Marketing',
      type: 'blog',
      date: '12.02.2023',
      status: 'published',
      description: 'Ein ausführlicher Überblick über den Einsatz von KI im modernen Marketing...'
    },
    {
      id: '2',
      title: 'Innovation als Erfolgsfaktor',
      type: 'linkedin',
      date: '28.03.2023',
      status: 'draft',
      description: 'Warum Unternehmen, die kontinuierlich innovieren, langfristig erfolgreicher sind...'
    },
    {
      id: '3',
      title: 'Content-Strategie für B2B-Unternehmen',
      type: 'blog',
      date: '05.04.2023',
      status: 'published',
      description: 'Best Practices für die Entwicklung einer effektiven B2B-Content-Strategie...'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Meine Inhalte</h2>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-primary hover:text-primary"
          onClick={() => navigate('/all-contents')}
        >
          Alle anzeigen 
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentContents.map((content) => (
          <ContentCard 
            key={content.id}
            content={content}
            onView={() => navigate(`/edit/${content.type}/${content.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentList;
