export const fetchDashBoardData = async (from_date: number, to_date: number): Promise<{ data: any }> => {
  try {
    const response = await fetch(`/dashboard_api.json?from=${from_date}&to=${to_date}`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: {} };
  }
};
