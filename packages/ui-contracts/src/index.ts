export interface ProductAccordionProps {
  title: string;
  children: unknown;
  defaultOpen?: boolean;
}

export interface VerificationBadgeProps {
  status: "verified" | "conflicting" | "missing" | "needs-review";
  label: string;
}

export interface SearchableListProps<T> {
  items: T[];
  query: string;
  getSearchText: (item: T) => string;
}
