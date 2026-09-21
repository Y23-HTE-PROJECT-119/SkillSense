const API_BASE_URL = "/api";


// Get all skills
export async function getSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch skills. Server returned ${response.status}.`,
    );
  }

  return response.json();
}


// Get all topics for a skill
export async function getTopicsBySkill(skillId) {
  const response = await fetch(
    `${API_BASE_URL}/skills/${skillId}/topics`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch topics. Server returned ${response.status}.`,
    );
  }

  return response.json();
}


// Get all sub-topics for a topic
export async function getSubTopicsByTopic(topicId) {
  const response = await fetch(
    `${API_BASE_URL}/topics/${topicId}/subtopics`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sub-topics. Server returned ${response.status}.`,
    );
  }

  return response.json();
}