export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  email_of_submitter: string;
  name_of_submitter: string;
  assigned_to_id: '' | number;
  created_by_id: null | number;
  created_at: string;
  updated_at: string;
  url: string;
  assigned_to_name: string;
}
export interface Comment {
  id: number;
  title: string;
  description: string;
  ticket_id: number;
  created_at: string;
  updated_at: string;
  url: string;
  commented_by_id: number;
  commented_by_name: string;
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
