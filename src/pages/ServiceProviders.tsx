import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StatusBadge } from "@/components/StatusBadge";
import { apiService, ServiceProvider } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Eye, Mail, Calendar, CreditCard, User } from "lucide-react";

export default function ServiceProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      const response = await apiService.getServiceProviders();
      setProviders(response.service_providers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleStatusUpdate = async (providerId: string, newStatus: "Approved" | "Blocked") => {
    setUpdating(providerId);
    try {
      await apiService.updateProviderStatus({ id: providerId, status: newStatus });
      toast({
        title: "Status Updated",
        description: `Provider status updated to ${newStatus}`
      });
      await fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const filterProviders = (status: string) => {
    return providers.filter(provider => 
      status === "all" || provider.status.toLowerCase() === status.toLowerCase()
    );
  };

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{provider.email}</span>
              </div>
              <StatusBadge status={provider.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{provider.account_details["account holder name"]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Requested: {new Date(provider.requested_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Services:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(provider.services).map(([key, service]) => (
                  <Badge key={key} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProvider(provider)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </Dialog>

            {provider.status === "pending" && (
              <Select onValueChange={(value) => handleStatusUpdate(provider.id, value as "Approved" | "Blocked")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approve</SelectItem>
                  <SelectItem value="Blocked">Block</SelectItem>
                </SelectContent>
              </Select>
            )}

            {updating === provider.id && <LoadingSpinner size={16} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Service Providers</h1>
        <p className="text-muted-foreground">Manage service provider applications and status</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Approval ({filterProviders("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filterProviders("approved").length})
          </TabsTrigger>
          <TabsTrigger value="blocked">
            Blocked ({filterProviders("blocked").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filterProviders("pending").map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {filterProviders("pending").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending providers
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filterProviders("approved").map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {filterProviders("approved").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No approved providers
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          {filterProviders("blocked").map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {filterProviders("blocked").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No blocked providers
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Provider Details Dialog */}
      {selectedProvider && (
        <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {selectedProvider.account_details["account holder name"]}</p>
                    <p><span className="text-muted-foreground">Account:</span> {selectedProvider.account_details["account number"]}</p>
                    <p><span className="text-muted-foreground">IFSC:</span> {selectedProvider.account_details["ifsc code"]}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <StatusBadge status={selectedProvider.status} />
                  {selectedProvider.approved_at && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Approved: {new Date(selectedProvider.approved_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedProvider.services).map(([key, service]) => (
                    <Badge key={key} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}