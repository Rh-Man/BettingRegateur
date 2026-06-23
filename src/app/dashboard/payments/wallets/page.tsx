import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function WalletsPage() {
  return (
    <div>
      <PageHeader
        title="Portefeuilles"
        description="Soldes et activité des portefeuilles opérateurs."
      />
      <Card>
        <CardContent className="p-0">
          <EmptyState
            title="Aucun portefeuille disponible"
            description="Aucun endpoint de portefeuille régulateur n’est actuellement exposé par le backend."
          />
        </CardContent>
      </Card>
    </div>
  );
}
