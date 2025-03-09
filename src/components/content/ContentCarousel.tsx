
import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard, { ContentCardProps } from '@/components/content/ContentCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
      {!isMobile && items.length > 0 && (
        <div className="flex items-center justify-end mb-4 gap-2">
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full bg-background dark:bg-background/20 transition-all duration-200",
                items.length <= 3 && "opacity-50"
              )}
              onClick={() => scroll('left')}
              disabled={items.length <= 3}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full bg-background dark:bg-background/20 transition-all duration-200",
                items.length <= 3 && "opacity-50"
              )}
              onClick={() => scroll('right')}
              disabled={items.length <= 3}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {items.length > 0 ? (
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-none snap-x scroll-smooth"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          {sortedItems.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[300px] sm:min-w-[360px] flex-shrink-0 snap-start"
            >
              <ContentCard {...item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glassmorphism-card p-8 text-center">
          <p className="text-muted-foreground mb-5">Keine Inhalte vorhanden</p>
          <Button 
            onClick={() => navigate('/create/blog')} 
            className="button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ersten Inhalt erstellen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentCarousel;
