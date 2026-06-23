import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function SettlementsPage() {
  return (
    <div>
      <PageHeader
        title="Règlements"
        description="Settlements et reversements aux opérateurs."
      />
      <Card>
        <CardContent className="p-0">
          <EmptyState
            title="Aucun règlement disponible"
            description="Le backend ne fournit pas encore d’endpoint de règlements Payment pour le périmètre régulateur."
          />
        </CardContent>
      </Card>
    </div>
  );
}
