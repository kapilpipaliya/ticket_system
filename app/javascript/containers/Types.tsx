export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  email: string;
  name: string;
  assignee_id: '' | number;
  creator_id: null | number;
  created_at: string;
  updated_at: string;
  url: string;
  assignee_name: string;
}

export interface CommentType {
  id: number;
  title: string;
  description: string;
  ticket_id: number;
  created_at: string;
  updated_at: string;
  url: string;
  commenter_id: number;
  commenter_name: string;
}

export interface CurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface TicketStatus {
  id: string;
  label: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface PagyParams {}

interface PagyVars {
  page: number;
  items: number;
  outset: number;
  size: number[];
  page_param: string;
  params: PagyParams;
  fragment: string;
  link_extra: string;
  i18n_key: string;
  cycle: boolean;
  metadata: string[];
  count: number;
}

export interface Pagy {
  scaffold_url: string;
  first_url: string;
  prev_url: string;
  page_url: string;
  next_url: string;
  last_url: string;
  count: number;
  page: number;
  items: number;
  vars: PagyVars;
  pages: number;
  last: number;
  from: number;
  to: number;
  prev: number;
  next: number;
  series: (number | string)[];
}

export enum SortDirection {
  None,
  Ascending,
  Descending,
}

export interface SortState {
  [key: string]: SortDirection;
}

export interface SearchState {
  name: string;
  email: string;
  subject: string;
  description: string;
}
