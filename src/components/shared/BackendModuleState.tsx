import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";

interface BackendModuleStateProps {
  title: string;
  description: string;
}

export function BackendModuleState({
  title,
  description,
}: BackendModuleStateProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <EmptyState title={title} description={description} />
      </CardContent>
    </Card>
  );
}
