import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OperatorLogo } from "@/components/operator-logo";
import { documents, OPERATORS } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Upload, Download, Trash2, FileText, Search } from "lucide-react";

export const Route = createFileRoute("/documents")({
  component: DocumentsPage,
  head: () => ({ meta: [{ title: "Documents" }] }),
});

function DocumentsPage() {
  return (
    <div>
      <PageHeader title="Documents" description={`${documents.length} documents`}
        actions={<Button size="sm"><Upload className="h-4 w-4 mr-1.5" />Uploader un document</Button>} />
      <Card className="mb-4"><CardContent className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-9" /></div>
        <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue placeholder="Opérateur" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous</SelectItem>{OPERATORS.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select defaultValue="all"><SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous types</SelectItem><SelectItem value="Licence">Licence</SelectItem><SelectItem value="Contrat">Contrat</SelectItem><SelectItem value="Rapport">Rapport</SelectItem></SelectContent>
        </Select>
      </CardContent></Card>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Document</TableHead><TableHead>Opérateur</TableHead><TableHead>Type</TableHead>
              <TableHead>Taille</TableHead><TableHead>Uploadé le</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{d.name}</span></div></TableCell>
                  <TableCell><div className="flex items-center gap-2"><OperatorLogo name={d.operator.name} color={d.operator.color} size={20} /><span className="text-sm">{d.operator.name}</span></div></TableCell>
                  <TableCell className="text-sm">{d.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.size}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(d.uploadedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
