import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "pending" | "Approved" | "Blocked" | "active" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-success text-success-foreground hover:bg-success/80";
      case "pending":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "blocked":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      case "active":
        return "bg-success text-success-foreground hover:bg-success/80";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge className={getStatusStyle(status)}>
      {status}
    </Badge>
  );
}