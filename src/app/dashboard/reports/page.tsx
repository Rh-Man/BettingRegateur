import { BackendModuleState } from "@/components/shared/BackendModuleState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Rapports"
        description="Rapports de conformité et statistiques du régulateur."
      />
      <BackendModuleState
        title="Génération de rapports non configurée"
        description="Les aperçus simulés et les faux téléchargements ont été retirés. L’API Reports doit être raccordée pour produire des documents réels."
      />
    </div>
  );
}
