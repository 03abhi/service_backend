import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, User, Wrench } from "lucide-react";

export default function ServiceHistory() {
  // Placeholder data - replace with actual API integration
  const mockHistory = [
    {
      id: "1",
      service: "Plumbing",
      customer: "John Doe",
      provider: "Mike Wilson",
      status: "completed",
      requestedAt: "2025-08-27T10:00:00",
      completedAt: "2025-08-27T12:30:00"
    },
    {
      id: "2", 
      service: "Electrical",
      customer: "Jane Smith",
      provider: "Alex Johnson",
      status: "in-progress",
      requestedAt: "2025-08-27T09:15:00",
      completedAt: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-warning text-warning-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Service History</h1>
        <p className="text-muted-foreground">Track all service requests and their status</p>
      </div>

      <div className="grid gap-4">
        {mockHistory.map(item => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{item.service} Service</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Customer: {item.customer}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Provider: {item.provider}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Requested: {new Date(item.requestedAt).toLocaleString()}</span>
                    </div>
                    {item.completedAt && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Completed: {new Date(item.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockHistory.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No service history available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}