import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  Building,
  Mail,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClaimStatusBadge } from '@/components/claims/ClaimStatusBadge';
import { AuditTimeline, AuditLogEntry } from '@/components/claims/AuditTimeline';
import { ChatInterface, ChatMessage } from '@/components/claims/ChatInterface';
import { FormBuilder, DataRequestSchema } from '@/components/claims/FormBuilder';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function AdminClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState('');
  const [auditNote, setAuditNote] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showFormBuilder, setShowFormBuilder] = useState(false);

  // Fetch claim details
  const { data: claim, isLoading } = useQuery({
    queryKey: ['admin-claim', id],
    queryFn: async () => {
      const response = await api.get(`/api/claims/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { status: string; auditNote: string; adminNotes?: string }) => {
      const response = await api.patch(`/api/claims/${id}/status`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-claim', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
      toast({
        title: 'Status Updated',
        description: 'Claim status has been successfully updated.',
      });
      setAuditNote('');
      setAdminNotes('');
      setNewStatus('');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post(`/api/claims/${id}/message`, {
        message,
        type: 'CHAT',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-claim', id] });
    },
  });

  // Send document request mutation
  const sendDocRequestMutation = useMutation({
    mutationFn: async (schema: DataRequestSchema) => {
      const response = await api.post(`/api/claims/${id}/message`, {
        message: schema.description || `Please provide the following information: ${schema.title}`,
        type: 'DOCUMENT_REQUEST',
        dataRequestSchema: schema,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-claim', id] });
      setShowFormBuilder(false);
      toast({
        title: 'Request Sent',
        description: 'Document request has been sent to the user.',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send request',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = () => {
    if (!newStatus || !auditNote.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a status and provide an audit note.',
        variant: 'destructive',
      });
      return;
    }

    updateStatusMutation.mutate({
      status: newStatus,
      auditNote: auditNote.trim(),
      adminNotes: adminNotes.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Claim Not Found</h2>
          <Button onClick={() => navigate('/admin/claims')}>
            Back to Claims
          </Button>
        </div>
      </div>
    );
  }

  const auditLog = (claim.auditLog as AuditLogEntry[]) || [];
  const messages = (claim.communications as ChatMessage[]) || [];
  const entityName = claim.university?.name || claim.universityGroup?.name || 'Unknown';

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/claims')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Claims
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Claim #{claim.id.slice(0, 8)}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <ClaimStatusBadge status={claim.status} />
              <span className="text-sm text-muted-foreground">
                Submitted {format(new Date(claim.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {claim.status === 'UNDER_REVIEW' && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setNewStatus('VERIFIED');
                    setAuditNote('Claim approved after review');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setNewStatus('REJECTED');
                    setAuditNote('Claim rejected after review');
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFormBuilder(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Request Info
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Evidence & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Claim Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{entityName}</h3>
                <Badge variant="outline">
                  {claim.university ? 'University' : 'University Group'}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Requester Name</Label>
                  <p className="font-medium">{claim.requesterName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Position</Label>
                  <p className="font-medium">{claim.position}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {claim.requesterEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Institutional Email</Label>
                  <p className="font-medium">{claim.institutionalEmail}</p>
                </div>
                {claim.department && (
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">{claim.department}</p>
                  </div>
                )}
              </div>

              {claim.comments && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Comments</Label>
                    <p className="mt-1 text-sm">{claim.comments}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Verification Documents
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {claim.verificationDocuments?.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1 truncate">Document {idx + 1}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-status">Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="ACTION_REQUIRED">Action Required</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audit-note">Audit Note (Required) *</Label>
                <Textarea
                  id="audit-note"
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder="Explain the reason for this status change..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Internal Admin Notes (Optional)</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Private notes for other admins..."
                  rows={2}
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || !auditNote.trim() || updateStatusMutation.isPending}
                className="w-full"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Communication & Audit */}
        <div className="space-y-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="audit">
                <Calendar className="h-4 w-4 mr-2" />
                Audit Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <Card className="h-[600px] flex flex-col">
                {showFormBuilder ? (
                  <div className="p-4 overflow-y-auto">
                    <FormBuilder
                      onSubmit={(schema) => sendDocRequestMutation.mutate(schema)}
                      onCancel={() => setShowFormBuilder(false)}
                      isLoading={sendDocRequestMutation.isPending}
                    />
                  </div>
                ) : (
                  <ChatInterface
                    messages={messages}
                    currentUserId={claim.reviewedBy?.id || ''}
                    onSendMessage={async (message) => {
                      await sendMessageMutation.mutateAsync(message);
                    }}
                    isLoading={sendMessageMutation.isPending}
                  />
                )}
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              <Card className="h-[600px] overflow-y-auto p-4">
                <AuditTimeline entries={auditLog} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
