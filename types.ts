export interface TaxonomyItem {
  category: string;
  id: string;
  label:string;
  prompt_text: string;
  tags: string[] | string; // Sheet might return string, we parse to array
  order: number;
}

export interface TaxonomyData {
  [key: string]: TaxonomyItem[];
}

export const REMOVE_SELECTION_ID = '__remove__';

export interface RemovalSelection {
  category: string;
  id: typeof REMOVE_SELECTION_ID;
  label: string;
}

export type SelectionValue = TaxonomyItem | RemovalSelection;

export interface Selections {
  [key: string]: SelectionValue;
}

export const isRemovalSelection = (
  value: SelectionValue | undefined
): value is RemovalSelection => value?.id === REMOVE_SELECTION_ID;

export interface AnalyzedTaxonomyItem {
  label: string;
  prompt_text: string;
  tags: string[];
}

export interface AnalyzedTaxonomyResult {
  [key: string]: AnalyzedTaxonomyItem;
}

export interface Category {
    id: string;
    label: string;
}

export interface VisualElementGroup {
    title: string;
    categories: Category[];
}
