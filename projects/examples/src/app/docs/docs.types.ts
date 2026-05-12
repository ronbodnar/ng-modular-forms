export type StepVariant =
  | 'install'
  | 'ui'
  | 'orchestrator'
  | 'handler'
  | 'mapper';

export interface TabContent {
  id: string;
  code: string;
  label?: string;
  language: 'shell' | 'typescript' | 'html';
}

export interface DocStep {
  id: string;
  title: string;
  description: string;
  variant: StepVariant;
  note?: string;
  tabs: TabContent[];
}
