import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  MoreVertical,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface NewsCommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onEditComment: (id: string, content: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
}

export function NewsComments({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: NewsCommentsProps) {
  const [newComment, setNewComment] = React.useState('');
  const [editingComment, setEditingComment] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment('');
  };

  const handleSubmitEdit = async (id: string) => {
    if (!editContent.trim()) return;
    await onEditComment(id, editContent);
    setEditingComment(null);
    setEditContent('');
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    await onAddComment(replyContent, parentId);
    setReplyingTo(null);
    setReplyContent('');
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={`p-4 ${isReply ? 'ml-8 mt-2' : 'mb-4'}`}>
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback>
            {comment.user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-grow space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {editingComment === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitEdit(comment.id)}
                >
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{comment.content}</p>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Responder
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="mt-4 ml-8 space-y-2">
          <Textarea
            placeholder="Escribe una respuesta..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
            >
              Responder
            </Button>
          </div>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} isReply />
      ))}
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment}>
            <Send className="mr-2 h-4 w-4" />
            Comentar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
