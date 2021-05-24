export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  sentiment?: string;
  sentiment_score?: number;
  email: string;
  name: string;
  assignee_id: '' | number;
  creator_id: null | number;
  comments_count?: number;
  assignee_comments?: number;
  created_at: string;
  updated_at: string;
  last_activity?: string;
  url: string;
  assignee_name: string;
}

export interface CommentType {
  id: number;
  description: string;
  ticket_id: number;
  sentiment?: string;
  sentiment_score?: number;
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
export interface Log {
  id: number;
  activity: string;
  created_at: string;
  updated_at: string;
}
