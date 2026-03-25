import type { Niveau, User } from "@/lib/db";
import type { MatiereUE, MentionNote, MatiereCoeffItem } from "../../types/notes";
import CoeffMentionForm, { type CoeffMentionSubmitValues } from "./form/CoeffMentionForm";
import CoeffMentionTable from "./table/CoeffMentionTable";

interface SaveEditValues {
  coefficient: number;
  credit: number;
  professeurId: number;
}

interface Props {
  matieres: MatiereUE[];
  mentions: MentionNote[];
  niveaux: Niveau[];
  professeurs?: User[];
  isAdmin?: boolean;
  mentionFixe?: { id: number | string; nom: string; abr?: string };
  overrideMentionId?: number | string;
  coeffMentions: MatiereCoeffItem[];
  onSubmit: (values: CoeffMentionSubmitValues) => Promise<void>;
  onVoirEtudiant?: (item: MatiereCoeffItem) => void;
  onSaveEdit?: (id: number, values: SaveEditValues) => Promise<void>;
}

export default function CoeffMentionSection({
  matieres,
  mentions,
  niveaux,
  professeurs,
  isAdmin,
  mentionFixe,
  overrideMentionId,
  coeffMentions,
  onSubmit,
  onVoirEtudiant,
  onSaveEdit,
}: Props) {
  return (
    <div className="space-y-6">
      <CoeffMentionForm
        matieres={matieres}
        mentions={mentions}
        niveaux={niveaux}
        professeurs={professeurs}
        isAdmin={isAdmin}
        mentionFixe={mentionFixe}
        overrideMentionId={overrideMentionId}
        onSubmit={onSubmit}
      />
      <CoeffMentionTable
        coeffMentions={coeffMentions}
        professeurs={professeurs}
        onVoirEtudiant={onVoirEtudiant}
        onSaveEdit={onSaveEdit}
      />
    </div>
  );
}
