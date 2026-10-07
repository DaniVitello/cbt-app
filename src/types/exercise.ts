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

export type Field = TextField | RatingField | RowsField;

export type Section = {
  id: string;
  title: string;
  fields: Field[];
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  sections: Section[];
};

export type Answers = Record<string, unknown>;
