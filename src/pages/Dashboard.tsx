import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, Activity } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [serviceProviders, setServiceProviders] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, providersResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getServiceProviders()
      ]);
      
      setTotalUsers(usersResponse.total_users);
      setServiceProviders(providersResponse.service_providers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalServiceProviders = serviceProviders.length;
  const pendingProviders = serviceProviders.filter(p => p.status === "pending").length;
  const approvedProviders = serviceProviders.filter(p => p.status === "Approved").length;

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
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServiceProviders}</div>
            <p className="text-xs text-muted-foreground">{pendingProviders} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Providers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProviders}</div>
            <p className="text-xs text-muted-foreground">Active service providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProviders}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceProviders.slice(0, 5).map((provider, i) => (
                <div key={provider.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm">Service provider registration - {provider.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(provider.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {serviceProviders.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <UserCheck className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Review Providers</p>
                <p className="text-xs text-muted-foreground">{pendingProviders} pending</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <Clock className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Total Users</p>
                <p className="text-xs text-muted-foreground">{totalUsers} registered</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}