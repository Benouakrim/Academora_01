import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type ClaimStatus = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'ACTION_REQUIRED' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'ARCHIVED';

interface StatusStepperProps {
  currentStatus: ClaimStatus;
  className?: string;
}

const steps = [
  { status: 'PENDING', label: 'Submitted' },
  { status: 'UNDER_REVIEW', label: 'Under Review' },
  { status: 'VERIFIED', label: 'Verified' },
];

const statusToStep: Record<ClaimStatus, number> = {
  PENDING: 0,
  UNDER_REVIEW: 1,
  ACTION_REQUIRED: 1, // Same level as under review
  VERIFIED: 2,
  REJECTED: -1, // Special case
  ARCHIVED: -1, // Special case
};

export function StatusStepper({ currentStatus, className }: StatusStepperProps) {
  const currentStep = statusToStep[currentStatus];
  const isRejected = currentStatus === 'REJECTED';
  const isArchived = currentStatus === 'ARCHIVED';

  if (isRejected || isArchived) {
    return (
      <div className={cn('py-6', className)}>
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">
            {isRejected ? 'Claim Rejected' : 'Claim Archived'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isRejected 
              ? 'Your claim was not approved. Please check the messages for more details.'
              : 'This claim has been archived.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-6', className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isActionRequired = currentStatus === 'ACTION_REQUIRED' && step.status === 'UNDER_REVIEW';

          return (
            <div 
              key={step.status} 
              className="flex flex-col items-center relative z-10"
              style={{ flex: 1 }}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  isComplete || isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background',
                  isActionRequired && 'animate-pulse border-amber-500 bg-amber-500'
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              <p className={cn(
                'mt-2 text-sm font-medium text-center',
                (isComplete || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.label}
              </p>

              {isActionRequired && (
                <p className="text-xs text-amber-600 font-semibold mt-1">
                  Action Required
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
