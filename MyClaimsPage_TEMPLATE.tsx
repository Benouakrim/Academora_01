// USER CLAIMS PAGE IMPLEMENTATION TEMPLATE
// File: client/src/pages/dashboard/MyClaimsPage.tsx
// 
// This file needs to be created manually. Here's the complete code:

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink, MessageSquare, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClaimStatusBadge } from '@/components/claims/ClaimStatusBadge';
import { StatusStepper } from '@/components/claims/StatusStepper';
import { ChatInterface, ChatMessage } from '@/components/claims/ChatInterface';
import { DataRequestForm } from '@/components/claims/DataRequestForm';
import type { DataRequestSchema } from '@/components/claims/FormBuilder';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; // Adjust import based on your API setup

export default function MyClaimsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // Fetch user's claims
  const { data: claims, isLoading } = useQuery({
    queryKey: ['my-claims'],
    queryFn: async () => {
      const response = await api.get('/api/claims/my-requests');
      return response.data.data;
    },
  });

  // Fetch selected claim details
  const { data: selectedClaim } = useQuery({
    queryKey: ['claim-detail', selectedClaimId],
    queryFn: async () => {
      if (!selectedClaimId) return null;
      const response = await api.get(`/api/claims/${selectedClaimId}`);
      return response.data.data;
    },
    enabled: !!selectedClaimId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post(`/api/claims/${selectedClaimId}/message`, {
        message,
        type: 'CHAT',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim-detail', selectedClaimId] });
    },
  });

  // Submit data mutation
  const submitDataMutation = useMutation({
    mutationFn: async (data: { submittedData: Record<string, any>; documents: string[] }) => {
      const response = await api.post(`/api/claims/${selectedClaimId}/submit-data`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim-detail', selectedClaimId] });
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
      toast({
        title: 'Submitted Successfully',
        description: 'Your information has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Failed to submit information',
        variant: 'destructive',
      });
    },
  });

  // Find the latest document request
  const latestDocRequest = selectedClaim?.communications
    ?.filter((msg: any) => msg.type === 'DOCUMENT_REQUEST')
    ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const dataRequestSchema: DataRequestSchema | null = latestDocRequest?.dataRequestSchema || null;
  const showActionRequired = selectedClaim?.status === 'ACTION_REQUIRED' && dataRequestSchema;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My University Claims</h1>
          <p className="text-muted-foreground">
            Track and manage your university ownership claims
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/claims/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Claims List */}
      {!claims || claims.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Claims Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any university ownership claims.
            </p>
            <Button onClick={() => navigate('/dashboard/claims/new')}>
              Submit Your First Claim
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {claims.map((claim: any) => {
            const entityName = claim.university?.name || claim.universityGroup?.name;
            const hasUnreadMessages = claim.communications?.length > 0;

            return (
              <Card
                key={claim.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedClaimId(claim.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{entityName}</h3>
                        <Badge variant="outline">
                          {claim.university ? 'University' : 'Group'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Submitted {format(new Date(claim.createdAt), 'MMM d, yyyy')}
                        </span>
                        {hasUnreadMessages && (
                          <span className="flex items-center gap-1 text-primary">
                            <MessageSquare className="h-3 w-3" />
                            {claim.communications.length} message(s)
                          </span>
                        )}
                      </div>

                      <ClaimStatusBadge status={claim.status} />
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Claim Detail Dialog */}
      <Dialog open={!!selectedClaimId} onOpenChange={() => setSelectedClaimId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Claim Details - {selectedClaim?.university?.name || selectedClaim?.universityGroup?.name}
            </DialogTitle>
            <DialogDescription>
              Track your claim status and communicate with administrators
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-6">
              {/* Status Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusStepper currentStatus={selectedClaim.status} />
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <ClaimStatusBadge status={selectedClaim.status} />
                  </div>
                </CardContent>
              </Card>

              {/* Action Required Section */}
              {showActionRequired && dataRequestSchema && (
                <DataRequestForm
                  schema={dataRequestSchema}
                  onSubmit={async (data, documents) => {
                    await submitDataMutation.mutateAsync({
                      submittedData: data,
                      documents,
                    });
                  }}
                  isLoading={submitDataMutation.isPending}
                />
              )}

              {/* Tabs for Details and Chat */}
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Claim Details</TabsTrigger>
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Position</p>
                          <p className="font-medium">{selectedClaim.position}</p>
                        </div>
                        {selectedClaim.department && (
                          <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-medium">{selectedClaim.department}</p>
                          </div>
                        )}
                      </div>

                      {selectedClaim.verificationDocuments?.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Verification Documents
                            </p>
                            <div className="space-y-2">
                              {selectedClaim.verificationDocuments.map((url: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <FileText className="h-4 w-4" />
                                  Document {idx + 1}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chat">
                  <Card className="h-[500px] flex flex-col">
                    <ChatInterface
                      messages={(selectedClaim.communications || []) as ChatMessage[]}
                      currentUserId={selectedClaim.userId}
                      onSendMessage={async (message) => {
                        await sendMessageMutation.mutateAsync(message);
                      }}
                      isLoading={sendMessageMutation.isPending}
                    />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
