export const getTimelines = async () => {
  try {
    const response = await fetch("/api/timeline", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
