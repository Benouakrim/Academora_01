import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Archive,
  FileText 
} from 'lucide-react';

type ClaimStatus = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'ACTION_REQUIRED' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'ARCHIVED';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

const statusConfig: Record<ClaimStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  PENDING: {
    label: 'Pending',
    variant: 'outline',
    icon: Clock,
    color: 'text-gray-600 bg-gray-100 border-gray-300',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    variant: 'default',
    icon: FileText,
    color: 'text-blue-700 bg-blue-100 border-blue-300',
  },
  ACTION_REQUIRED: {
    label: 'Action Required',
    variant: 'destructive',
    icon: AlertCircle,
    color: 'text-amber-700 bg-amber-100 border-amber-300',
  },
  VERIFIED: {
    label: 'Verified',
    variant: 'default',
    icon: CheckCircle2,
    color: 'text-green-700 bg-green-100 border-green-300',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'destructive',
    icon: XCircle,
    color: 'text-red-700 bg-red-100 border-red-300',
  },
  ARCHIVED: {
    label: 'Archived',
    variant: 'secondary',
    icon: Archive,
    color: 'text-gray-500 bg-gray-100 border-gray-300',
  },
};

export function ClaimStatusBadge({ status, className }: ClaimStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 font-medium',
        config.color,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </Badge>
  );
}
