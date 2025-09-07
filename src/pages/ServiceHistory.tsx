import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService, type ServiceHistoryItem } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function ServiceHistory() {
  const [history, setHistory] = useState<ServiceHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getServiceHistory();
        setHistory(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch service history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    const date = new Date(value.replace(" ", "T"));
    return isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Service History</h1>
        <p className="text-muted-foreground">Track all service requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-48">
          <LoadingSpinner size={28} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Requested Slot</TableHead>
                  <TableHead>Service Cost</TableHead>
                  <TableHead>Request Raised</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(item => (
                  <TableRow key={item.service_id}>
                    <TableCell className="capitalize">{item.category}</TableCell>
                    <TableCell>{item.service_type}</TableCell>
                    <TableCell>{formatDateTime(item.requested_slot)}</TableCell>
                    <TableCell>₹{item.service_cost}</TableCell>
                    <TableCell>{formatDateTime(item.created_at)}</TableCell>
                  </TableRow>
                ))}
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <div className="flex flex-col items-center gap-2">
                        <History className="h-6 w-6 opacity-50" />
                        <span>No service history available</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}