import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
}

interface AuditTimelineProps {
  entries: AuditLogEntry[];
  className?: string;
}

export function AuditTimeline({ entries, className }: AuditTimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No audit log entries yet
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {entries.map((entry, index) => (
        <div key={index} className="relative pl-8 pb-4">
          {/* Timeline line */}
          {index !== entries.length - 1 && (
            <div className="absolute left-3 top-8 bottom-0 w-px bg-border" />
          )}

          {/* Timeline dot */}
          <div className="absolute left-0 top-1.5 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
          </div>

          {/* Content */}
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="text-xs">
                    {entry.userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{entry.userName}</span>
                    {entry.fromStatus && entry.toStatus && (
                      <div className="flex items-center gap-1 text-xs">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {entry.fromStatus}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {entry.toStatus}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.action}
                  </p>

                  {entry.note && (
                    <p className="text-sm mt-2 p-2 bg-muted rounded-md">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>

              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
              </time>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
