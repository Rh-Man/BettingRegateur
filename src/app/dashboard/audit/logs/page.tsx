import { BackendModuleState } from "@/components/shared/BackendModuleState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function AuditLogsPage() {
  return (
    <div>
      <PageHeader
        title="Audit"
        description="Synthèse et journal des opérations contrôlées."
      />
      <BackendModuleState
        title="Journal d’audit non chargé"
        description="Les données fictives ont été retirées. L’URL de l’API Audit est nécessaire pour charger la synthèse et les événements réels."
      />
    </div>
  );
}
