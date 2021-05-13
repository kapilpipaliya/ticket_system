import { Ticket } from '../containers/Types';

interface DashboardData {
  data: {
    assigned: number;
    close: number;
    hold: number;
    new_tickets: number;
    open: number;
    replies: number;
    tickets_per_day: number;
    unresolved_count: number;
  };
}

export const fetchDashBoardData = async (from_date: number, to_date: number): Promise<DashboardData> => {
  try {
    const response = await fetch(`/dashboard_api.json?from=${from_date}&to=${to_date}`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: {} } as DashboardData;
  }
};

export interface LastActivityData {
  data: { latest_activity: Ticket[] };
}

export const fetchLastActivityData = async (from_date: number, to_date: number, limit: number = 5): Promise<LastActivityData> => {
  try {
    const limitQuery = limit ? `&limit=${limit}` : '';
    const response = await fetch(`/latest_activity.json?from=${from_date}&to=${to_date}${limitQuery}`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: {} } as LastActivityData;
  }
};

interface DashBordStaticData {
  data: { overdue_count: number; due_today: number };
}

export const fetchDashBoardStaticData = async (): Promise<DashBordStaticData> => {
  try {
    const response = await fetch(`/dashboard_static_api.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: {} } as DashBordStaticData;
  }
};
