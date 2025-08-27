import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, MapPin, Clock, Wrench } from "lucide-react";

export default function ProviderAllocation() {
  // Placeholder data - replace with actual API integration
  const mockRequests = [
    {
      id: "1",
      service: "Plumbing",
      customer: "John Doe",
      location: "Downtown Area",
      priority: "high",
      requestedAt: "2025-08-27T10:00:00",
      status: "unassigned"
    },
    {
      id: "2",
      service: "Electrical",
      customer: "Jane Smith", 
      location: "Suburb West",
      priority: "medium",
      requestedAt: "2025-08-27T09:15:00",
      status: "assigned"
    }
  ];

  const mockProviders = [
    { id: "1", name: "Mike Wilson", service: "Plumbing", rating: 4.8 },
    { id: "2", name: "Alex Johnson", service: "Electrical", rating: 4.9 },
    { id: "3", name: "Sarah Davis", service: "Plumbing", rating: 4.7 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Provider Allocation</h1>
        <p className="text-muted-foreground">Assign service providers to customer requests</p>
      </div>

      <div className="grid gap-4">
        {mockRequests.map(request => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{request.service} Request</h3>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority} priority
                    </Badge>
                    <Badge variant={request.status === "assigned" ? "default" : "secondary"}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      <span>Customer: {request.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Location: {request.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Requested: {new Date(request.requestedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {request.status === "unassigned" && (
                  <div className="flex items-center space-x-3 ml-4">
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Assign Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProviders
                          .filter(provider => provider.service === request.service)
                          .map(provider => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} (★ {provider.rating})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm">
                      Assign
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {mockRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending allocation requests</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}