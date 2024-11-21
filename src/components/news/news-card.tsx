import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { News, ImpactLevel } from '@/types/news';
import { format } from 'date-fns';
import { LinkPreview } from '../ui/link-preview';
import {
  Calendar,
  ExternalLink,
  Eye,
  MessageCircle,
  Share2,
  Tag,
  Trash2,
  Edit,
} from 'lucide-react';

interface NewsCardProps {
  news: News;
  onView?: (news: News) => void;
  onEdit?: (news: News) => void;
  onDelete?: (news: News) => void;
  onShare?: (news: News) => void;
}

const getImpactColor = (impact: ImpactLevel): string => {
  switch (impact) {
    case 'high':
      return 'bg-red-500 hover:bg-red-600';
    case 'medium':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'low':
      return 'bg-green-500 hover:bg-green-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export function NewsCard({ news, onView, onEdit, onDelete, onShare }: NewsCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {news.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(news.publishedAt), 'PPP')}
            </p>
          </div>
          <Badge className={getImpactColor(news.impactLevel)}>
            {news.impactLevel.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {news.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="flex items-center gap-1"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              <Tag className="h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <LinkPreview 
          url={news.url} 
          showActions={false}
          maxDescriptionLength={100}
        />
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(new Date(news.createdAt), 'PP')}
        </div>
        
        <div className="flex gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={() => onView(news)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver</span>
            </Button>
          )}
          
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(news)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          )}
          
          {onShare && (
            <Button variant="ghost" size="sm" onClick={() => onShare(news)}>
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Compartir</span>
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(news)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Abrir enlace</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
