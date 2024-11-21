import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';
import { Badge } from './badge';
import { Button } from './button';
import { 
  ExternalLink, 
  Globe, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Share2, 
  BookmarkPlus,
  Clock,
  Calendar
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from './use-toast';

interface OpenGraphData {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string }[];
  ogSiteName?: string;
  ogUrl?: string;
  ogType?: string;
  ogDate?: string;
  ogAuthor?: string;
  articlePublishedTime?: string;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
  onSave?: (data: OpenGraphData) => void;
  onShare?: (url: string) => void;
  showActions?: boolean;
  showMetadata?: boolean;
  maxDescriptionLength?: number;
}

const getSocialIcon = (url: string) => {
  if (url.includes('twitter.com')) return <Twitter className="h-4 w-4" />;
  if (url.includes('facebook.com')) return <Facebook className="h-4 w-4" />;
  if (url.includes('linkedin.com')) return <Linkedin className="h-4 w-4" />;
  return <Globe className="h-4 w-4" />;
};

const getReadingTime = (text?: string): number => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const LinkPreview: React.FC<LinkPreviewProps> = ({ 
  url, 
  className,
  onSave,
  onShare,
  showActions = true,
  showMetadata = true,
  maxDescriptionLength = 150
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OpenGraphData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/link-preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch link preview');
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  const handleShare = async () => {
    if (onShare) {
      onShare(url);
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: data?.ogTitle,
          text: data?.ogDescription,
          url: url
        });
        toast({
          title: "Shared successfully",
          description: "The link has been shared.",
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          toast({
            title: "Error sharing",
            description: "Failed to share the link.",
            variant: "destructive",
          });
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      });
    }
  };

  const handleSave = () => {
    if (data && onSave) {
      onSave(data);
      toast({
        title: "Saved successfully",
        description: "The article has been saved.",
      });
    }
  };

  const truncateDescription = (text?: string) => {
    if (!text || text.length <= maxDescriptionLength) return text;
    return `${text.substring(0, maxDescriptionLength)}...`;
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error loading preview</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
        {showMetadata && (
          <CardFooter>
            <Skeleton className="h-3 w-1/4" />
          </CardFooter>
        )}
      </Card>
    );
  }

  if (!data) return null;

  const publishDate = data.articlePublishedTime || data.ogDate;
  const readingTime = getReadingTime(data.ogDescription);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{data.ogTitle}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getSocialIcon(url)}
            {data.ogSiteName}
          </Badge>
        </div>
        <CardDescription>{truncateDescription(data.ogDescription)}</CardDescription>
        {showMetadata && (
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            {publishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(publishDate), 'MMM d, yyyy')}
              </div>
            )}
            {readingTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </div>
            )}
            {data.ogAuthor && (
              <div className="flex items-center gap-1">
                By {data.ogAuthor}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      {data.ogImage?.[0]?.url && (
        <CardContent>
          <div className="relative h-48 w-full overflow-hidden rounded-md">
            <Image
              src={data.ogImage[0].url}
              alt={data.ogTitle || 'Link preview'}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          {showActions && (
            <>
              {onSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Save
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </>
          )}
        </div>
        <a
          href={data.ogUrl || url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Visit site
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};
