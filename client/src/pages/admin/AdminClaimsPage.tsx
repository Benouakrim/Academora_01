import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, ExternalLink, FileText, Building2, Eye, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import type { LucideIcon } from 'lucide-react';
import { useAllClaims, useReviewClaim } from '@/hooks/useClaims';
import { DocumentReview } from '@/components/claims/DocumentReview';

type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type UniversityClaim = {
  id: string;
  status: ClaimStatus;
  requesterName: string;
  requesterEmail: string;
  position: string;
  department?: string;
  verificationDocuments: string[];
  comments?: string;
  adminNotes?: string;
  createdAt: string;
  expiresAt: string;
  reviewedAt?: string;
  university?: {
    id: string;
    name: string;
    slug: string;
  };
  universityGroup?: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedBy?: {
    firstName: string;
    lastName: string;
  };
};

type ClaimsResponse = {
  status: string;
  data: UniversityClaim[];
};

export default function AdminClaimsPage() {
  const queryClient = useQueryClient();
  const [selectedClaim, setSelectedClaim] = useState<UniversityClaim | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'ALL'>('PENDING');

  const { data, isLoading } = useAllClaims(statusFilter === 'ALL' ? undefined : statusFilter);
  const claims = data?.data || [];

  const reviewMutation = useReviewClaim();

  const handleReview = (action: 'APPROVED' | 'REJECTED') => {
    if (!selectedClaim) return;
    reviewMutation.mutate({
      claimId: selectedClaim.id,
      data: {
        status: action,
        adminNotes: adminNotes || undefined,
      }
    }, {
      onSuccess: () => {
        setSelectedClaim(null);
        setViewMode(null);
        setAdminNotes('');
      }
    });
  };

  const openViewDialog = (claim: UniversityClaim) => {
    setSelectedClaim(claim);
    setViewMode('view');
    setAdminNotes('');
  };

  const columns: ColumnDef<UniversityClaim>[] = [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ClaimStatus;
        const variants: Record<ClaimStatus, { badge: string; icon: LucideIcon }> = {
          PENDING: { badge: 'bg-yellow-100 text-yellow-800', icon: Clock },
          APPROVED: { badge: 'bg-green-100 text-green-800', icon: CheckCircle },
          REJECTED: { badge: 'bg-red-100 text-red-800', icon: XCircle },
        };
        const config = variants[status] || variants.PENDING;
        const Icon = config.icon;
        return (
          <Badge className={config.badge}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt') as string);
        return <span className="text-sm">{format(date, 'MMM d, yyyy')}</span>;
      },
    },
    {
      accessorKey: 'requesterName',
      header: 'Requester',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('requesterName') as string}</div>
          <div className="text-xs text-gray-500">{row.original.requesterEmail}</div>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => (
        <div>
          <div className="text-sm">{row.getValue('position') as string}</div>
          {row.original.department && (
            <div className="text-xs text-gray-500">{row.original.department}</div>
          )}
        </div>
      ),
    },
    {
      id: 'target',
      header: 'Target',
      cell: ({ row }) => {
        const claim = row.original;
        if (claim.university) {
          return (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{claim.university.name}</span>
            </div>
          );
        }
        if (claim.universityGroup) {
          return (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{claim.universityGroup.name} (Group)</span>
            </div>
          );
        }
        return <span className="text-gray-400">—</span>;
      },
    },
    {
      accessorKey: 'verificationDocuments',
      header: 'Docs',
      cell: ({ row }) => {
        const docs = row.getValue('verificationDocuments') as string[];
        return (
          <Badge variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            {docs.length}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const claim = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openViewDialog(claim)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {claim.status === 'PENDING' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => {
                    setSelectedClaim(claim);
                    setViewMode('approve');
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedClaim(claim);
                    setViewMode('reject');
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const stats = {
    pending: claims.filter((c) => c.status === 'PENDING').length,
    approved: claims.filter((c) => c.status === 'APPROVED').length,
    rejected: claims.filter((c) => c.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">University Claims</h2>
        <p className="text-gray-600 text-sm mt-1">Review and manage university ownership requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Label>Filter:</Label>
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {claims.length > 0 ? (
        <DataTable columns={columns} data={claims} />
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
            <p>There are no {statusFilter.toLowerCase()} claims at this time.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedClaim} onOpenChange={() => {
        setSelectedClaim(null);
        setViewMode(null);
        setAdminNotes('');
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'approve' ? 'Approve Claim' : viewMode === 'reject' ? 'Reject Claim' : 'Claim Details'}
            </DialogTitle>
            <DialogDescription>
              {viewMode === 'view' ? 'Review claim information' : 'Review the details before making a decision'}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Claim Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="user">User Account</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Requester</Label>
                    <p className="font-medium">{selectedClaim.requesterName}</p>
                    <p className="text-gray-600">{selectedClaim.requesterEmail}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Position</Label>
                    <p className="font-medium">{selectedClaim.position}</p>
                    {selectedClaim.department && (
                      <p className="text-gray-600">{selectedClaim.department}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500">Target University/Group</Label>
                  <p className="font-medium">
                    {selectedClaim.university?.name || selectedClaim.universityGroup?.name}
                  </p>
                </div>

                {selectedClaim.comments && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-xs text-gray-500">Requester Comments</Label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedClaim.comments}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500">Verification Documents</Label>
                  <div className="space-y-2 mt-2">
                    {selectedClaim.verificationDocuments.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border rounded hover:bg-accent text-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Document {idx + 1}
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>

                {(viewMode === 'approve' || viewMode === 'reject') && (
                  <>
                    <Separator />
                    <div>
                      <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes about this decision..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-4">
                <DocumentReview claimId={selectedClaim.id} isAdmin={true} />
              </TabsContent>

              <TabsContent value="user" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg bg-muted">
                  <div className="flex items-start gap-3">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {selectedClaim.user.firstName} {selectedClaim.user.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedClaim.user.email}</p>
                      <Badge className="mt-2">User ID: {selectedClaim.user.id}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Claim Information</Label>
                  <div className="space-y-2 text-sm">
                    <p><strong>Submitted:</strong> {format(new Date(selectedClaim.createdAt), 'PPP')}</p>
                    <p><strong>Expires:</strong> {format(new Date(selectedClaim.expiresAt), 'PPP')}</p>
                    {selectedClaim.reviewedAt && (
                      <p><strong>Reviewed:</strong> {format(new Date(selectedClaim.reviewedAt), 'PPP')}</p>
                    )}
                    {selectedClaim.reviewedBy && (
                      <p>
                        <strong>Reviewed by:</strong> {selectedClaim.reviewedBy.firstName} {selectedClaim.reviewedBy.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {selectedClaim.adminNotes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-xs text-gray-500">Previous Admin Notes</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedClaim.adminNotes}</p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedClaim(null);
              setViewMode(null);
              setAdminNotes('');
            }}>
              {viewMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {viewMode === 'approve' && (
              <Button
                onClick={() => handleReview('APPROVED')}
                disabled={reviewMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {reviewMutation.isPending ? 'Processing...' : 'Confirm Approval'}
              </Button>
            )}
            {viewMode === 'reject' && (
              <Button
                onClick={() => handleReview('REJECTED')}
                disabled={reviewMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {reviewMutation.isPending ? 'Processing...' : 'Confirm Rejection'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
