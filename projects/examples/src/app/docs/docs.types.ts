export type StepVariant =
  | 'install'
  | 'styles'
  | 'ui'
  | 'orchestrator'
  | 'handler'
  | 'mapper';

export interface TabContent {
  id: string;
  code: string;
  label?: string;
  language: 'shell' | 'typescript' | 'html' | 'css' | 'json';
}

export interface DocStep {
  id: string;
  title: string;
  description: string;
  variant: StepVariant;
  note?: string;
  tabs: TabContent[];
}
