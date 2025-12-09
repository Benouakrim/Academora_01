import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, Paperclip, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface ChatMessage {
  id: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
  };
  message: string;
  attachments?: string[];
  type: 'CHAT' | 'DOCUMENT_REQUEST' | 'INTERNAL_NOTE';
  isInternalNote: boolean;
  dataRequestSchema?: Record<string, unknown>;
  createdAt: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string, attachments?: string[]) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function ChatInterface({
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
  className,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation below</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            const isAdmin = msg.sender.role === 'ADMIN';
            const isDocumentRequest = msg.type === 'DOCUMENT_REQUEST';

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  isOwn ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className={cn(
                    'text-xs',
                    isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}>
                    {`${msg.sender.firstName[0]}${msg.sender.lastName[0]}`}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    'flex flex-col max-w-[70%]',
                    isOwn ? 'items-end' : 'items-start'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {msg.sender.firstName} {msg.sender.lastName}
                    </span>
                    {isAdmin && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </span>
                  </div>

                  <Card
                    className={cn(
                      'p-3',
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : isDocumentRequest
                        ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                        : 'bg-muted'
                    )}
                  >
                    {isDocumentRequest && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                          Document Request
                        </span>
                      </div>
                    )}

                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t space-y-1">
                        {msg.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs hover:underline"
                          >
                            <Paperclip className="h-3 w-3" />
                            Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isSending || isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
