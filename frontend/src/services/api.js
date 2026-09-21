const API_BASE_URL = "/api";


export async function getSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch skills. Server returned ${response.status}.`,
    );
  }

  return response.json();
}