export type dropdownOption = {
  label: string;
  icon: string;
  value?: number;
  sqlValue?: string;
  click: () => void;
};