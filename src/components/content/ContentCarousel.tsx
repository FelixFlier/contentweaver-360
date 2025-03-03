
import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard, { ContentCardProps } from '@/components/content/ContentCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface ContentCarouselProps {
  title: string;
  items: ContentCardProps[];
  seeAllLink?: string;
}

const ContentCarousel = ({ title, items, seeAllLink }: ContentCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Sort items by priority: feedback > inProgress > completed
  const sortedItems = [...items].sort((a, b) => {
    const priority = { feedback: 0, inprogress: 1, completed: 2 };
    return priority[a.status] - priority[b.status];
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollTo = direction === 'left' 
      ? scrollLeft - clientWidth / 2
      : scrollLeft + clientWidth / 2;
    
    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Add a visual indicator for horizontal scrollability
    const carousel = carouselRef.current;
    if (!carousel || items.length <= 1) return;
    
    // Add shadow/gradient indicators based on scroll position
    const handleScroll = () => {
      const isAtStart = carousel.scrollLeft <= 10;
      const isAtEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
      
      carousel.classList.toggle('shadow-left', !isAtStart);
      carousel.classList.toggle('shadow-right', !isAtEnd);
    };
    
    carousel.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        {!isMobile && items.length > 0 && (
          <div className="flex items-center gap-2">
            {seeAllLink && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(seeAllLink)}
              >
                Alle anzeigen
              </Button>
            )}
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => scroll('left')}
                disabled={items.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => scroll('right')}
                disabled={items.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {items.length > 0 ? (
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x scroll-smooth"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          {sortedItems.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[300px] sm:min-w-[320px] flex-shrink-0 snap-start"
            >
              <ContentCard {...item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg border border-border p-6 text-center">
          <p className="text-muted-foreground mb-3">Keine Inhalte vorhanden</p>
          <Button onClick={() => navigate('/create/blog')}>
            Ersten Inhalt erstellen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentCarousel;
