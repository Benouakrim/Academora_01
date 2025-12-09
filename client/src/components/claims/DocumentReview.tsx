import { useState } from 'react';
import { FileText, Image, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClaimDocuments, useReviewDocument } from '@/hooks/useClaims';

interface DocumentReviewProps {
  claimId: string;
  isAdmin?: boolean;
}

interface DocumentApproval {
  id: string;
  documentUrl: string;
  documentType: 'image' | 'pdf';
  documentName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPLACED';
  adminNotes?: string;
  reviewedAt?: string;
  canResubmit: boolean;
  reviewedBy?: {
    firstName: string;
    lastName: string;
  };
}

export function DocumentReview({ claimId, isAdmin = false }: DocumentReviewProps) {
  const { data: documentsResponse, isLoading } = useClaimDocuments(claimId);
  const documents: DocumentApproval[] = documentsResponse?.data || [];
  
  const [selectedDoc, setSelectedDoc] = useState<DocumentApproval | null>(null);
  const [reviewMode, setReviewMode] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const reviewMutation = useReviewDocument();

  const handleReview = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedDoc) return;
    
    reviewMutation.mutate({
      documentId: selectedDoc.id,
      data: {
        status,
        adminNotes: adminNotes || undefined,
      },
    }, {
      onSuccess: () => {
        setSelectedDoc(null);
        setReviewMode(null);
        setAdminNotes('');
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: typeof Clock; label: string }> = {
      PENDING: { 
        className: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        label: 'Pending Review' 
      },
      APPROVED: { 
        className: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Approved' 
      },
      REJECTED: { 
        className: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Rejected' 
      },
      REPLACED: { 
        className: 'bg-blue-100 text-blue-800', 
        icon: AlertCircle, 
        label: 'Replaced' 
      },
    };

    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {doc.documentType === 'pdf' ? (
                  <FileText className="h-10 w-10 text-red-500 flex-shrink-0" />
                ) : (
                  <Image className="h-10 w-10 text-blue-500 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      {doc.documentName || `Document ${index + 1}`}
                    </h4>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  {doc.adminNotes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Admin Notes:</strong> {doc.adminNotes}
                    </p>
                  )}
                  
                  {doc.reviewedBy && doc.reviewedAt && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed by {doc.reviewedBy.firstName} {doc.reviewedBy.lastName} on{' '}
                      {new Date(doc.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.documentUrl, '_blank')}
                >
                  View
                </Button>
                
                {isAdmin && doc.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewMode('approve');
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewMode('reject');
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedDoc && !!reviewMode}
        onOpenChange={() => {
          setSelectedDoc(null);
          setReviewMode(null);
          setAdminNotes('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewMode === 'approve' ? 'Approve Document' : 'Reject Document'}
            </DialogTitle>
            <DialogDescription>
              {reviewMode === 'approve'
                ? 'Confirm that this document is valid and meets all requirements.'
                : 'Provide a reason for rejecting this document so the user can resubmit.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Admin Notes {reviewMode === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  reviewMode === 'approve'
                    ? 'Optional notes about the approval...'
                    : 'Explain why this document is being rejected...'
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDoc(null);
                setReviewMode(null);
                setAdminNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReview(reviewMode === 'approve' ? 'APPROVED' : 'REJECTED')}
              disabled={reviewMutation.isPending || (reviewMode === 'reject' && !adminNotes)}
              className={
                reviewMode === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {reviewMutation.isPending ? 'Processing...' : `Confirm ${reviewMode === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
