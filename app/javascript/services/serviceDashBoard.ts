export const fetchDashBoardData = async (from_date: number, to_date: number): Promise<{ data: any }> => {
  try {
    const response = await fetch(`/dashboard_api.json?from=${from_date}&to=${to_date}`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: {} };
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
