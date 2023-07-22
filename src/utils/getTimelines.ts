export const getTimelines = async (key: string, page = 0) => {
  const response = await fetch(`/api/timeline?page=${page}`);
  const data = await response.json();
  return data;
};