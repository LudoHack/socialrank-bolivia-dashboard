import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Activity,
  Edit,
  Tag,
  Trash,
  AlertTriangle,
  Share2,
  Eye,
  Clock,
  User,
} from 'lucide-react';

interface HistoryEntry {
  id: string;
  type:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'status_changed'
    | 'impact_changed'
    | 'tags_changed'
    | 'viewed'
    | 'shared';
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  details?: {
    from?: any;
    to?: any;
    field?: string;
  };
}

interface NewsHistoryProps {
  history: HistoryEntry[];
}

export function NewsHistory({ history }: NewsHistoryProps) {
  const getActivityIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'created':
        return <Activity className="h-4 w-4" />;
      case 'updated':
        return <Edit className="h-4 w-4" />;
      case 'deleted':
        return <Trash className="h-4 w-4" />;
      case 'status_changed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'impact_changed':
        return <Activity className="h-4 w-4" />;
      case 'tags_changed':
        return <Tag className="h-4 w-4" />;
      case 'viewed':
        return <Eye className="h-4 w-4" />;
      case 'shared':
        return <Share2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'created':
        return 'bg-green-500';
      case 'updated':
        return 'bg-blue-500';
      case 'deleted':
        return 'bg-red-500';
      case 'status_changed':
        return 'bg-yellow-500';
      case 'impact_changed':
        return 'bg-purple-500';
      case 'tags_changed':
        return 'bg-indigo-500';
      case 'viewed':
        return 'bg-gray-500';
      case 'shared':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityDescription = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'created':
        return 'creó la noticia';
      case 'updated':
        return `actualizó ${entry.details?.field || 'la noticia'}`;
      case 'deleted':
        return 'eliminó la noticia';
      case 'status_changed':
        return `cambió el estado de "${entry.details?.from}" a "${entry.details?.to}"`;
      case 'impact_changed':
        return `cambió el impacto de "${entry.details?.from}" a "${entry.details?.to}"`;
      case 'tags_changed':
        return 'actualizó las etiquetas';
      case 'viewed':
        return 'vió la noticia';
      case 'shared':
        return 'compartió la noticia';
      default:
        return 'realizó una acción';
    }
  };

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <Card key={entry.id} className="p-4">
          <div className="flex items-start space-x-4">
            <div
              className={`${getActivityColor(
                entry.type
              )} p-2 rounded-full text-white`}
            >
              {getActivityIcon(entry.type)}
            </div>

            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{entry.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {getActivityDescription(entry)}
                </span>
              </div>

              {entry.details && entry.type === 'tags_changed' && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {entry.details.from && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Etiquetas eliminadas:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.details.from.map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.details.to && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Etiquetas agregadas:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.details.to.map((tag: string) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(entry.timestamp), 'PPpp', { locale: es })}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {history.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2" />
          <p>No hay historial disponible</p>
        </div>
      )}
    </div>
  );
}
