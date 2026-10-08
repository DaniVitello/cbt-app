export type TextField = {
  type: "text";
  id: string;
  label: string;
  placeholder?: string;
};

export type RatingField = {
  type: "rating";
  id: string;
  label: string;
  min: number;
  max: number;
};

export type RowsField = {
  type: "rows";
  id: string;
  label: string;
  columns: Field[];
};

export type ChoiceField = {
  type: "choice";
  id: string;
  label: string;
  options: { value: string; label: string }[];
};

export type GroupField = {
  type: "group";
  id: string;
  label: string;
  groups: {
    id: string;
    label: string;
    fields: Field[];
  }[];
};

export type ReadOnlyField = {
  type: "readonly";
  id: string;
  label: string;
  content: string;
};

export type Field =
  | TextField
  | RatingField
  | RowsField
  | ChoiceField
  | GroupField
  | ReadOnlyField;

export type Section = {
  id: string;
  title: string;
  fields: Field[];
};

export type Intent = "now" | "belief" | "action" | "relax";

export type Measure = {
  id: string;
  labelBefore: string;
  labelAfter: string;
  min: number;
  max: number;
};

export type OutputKind = "belief" | "thought" | "situation" | "emotion" | "action";

export type ExerciseOutput = {
  fieldId: string;
  kind: OutputKind;
};

export type ExerciseAccept = {
  kind: OutputKind;
  intoFieldId: string;
};

export type Exercise = {
  id: string;
  version: number;
  title: string;
  description: string;
  category: string;
  intents: Intent[];
  measure?: Measure;
  sections: Section[];
  outputs?: ExerciseOutput[];
  accepts?: ExerciseAccept[];
  next?: string[];
  help?: { purpose?: string; example?: string };
};

export type Answers = Record<string, unknown>;
