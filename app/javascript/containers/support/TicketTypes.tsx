export interface Ticket {
    id: number;
    subject: string;
    description: string;
    email_of_submitter: string;
    name_of_submitter: string;
    assigned_to: string;
    created_at: string;
    updated_at: string;
    url: string;
}
export interface Comment {
    id: number;
    title: string;
    description: string;
    ticket_id: number;
    created_at: string;
    updated_at: string;
    url: string;
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