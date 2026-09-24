// const API_BASE_URL = "/api";


// // Get all skills
// export async function getSkills() {
//   const response = await fetch(`${API_BASE_URL}/skills`);

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch skills. Server returned ${response.status}.`,
//     );
//   }

//   return response.json();
// }


// // Get all topics for a skill
// export async function getTopicsBySkill(skillId) {
//   const response = await fetch(
//     `${API_BASE_URL}/skills/${skillId}/topics`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch topics. Server returned ${response.status}.`,
//     );
//   }

//   return response.json();
// }


// // Get all sub-topics for a topic
// export async function getSubTopicsByTopic(topicId) {
//   const response = await fetch(
//     `${API_BASE_URL}/topics/${topicId}/subtopics`,
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch sub-topics. Server returned ${response.status}.`,
//     );
//   }

//   return response.json();
// }

const API_BASE_URL = "/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text || null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

/* Skills */

export async function getSkills() {
  return apiRequest("/skills");
}

export async function createSkill(skill) {
  return apiRequest("/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });
}

/* Topics */

export async function getTopics(skillId) {
  return apiRequest(`/skills/${skillId}/topics`);
}

export async function getTopicsBySkill(skillId) {
  return apiRequest(`/skills/${skillId}/topics`);
}

export async function createTopic(skillId, topic) {
  return apiRequest(`/skills/${skillId}/topics`, {
    method: "POST",
    body: JSON.stringify(topic),
  });
}

/* Sub-topics */

export async function getSubTopics(topicId) {
  return apiRequest(`/topics/${topicId}/subtopics`);
}

export async function getSubTopicsByTopic(topicId) {
  return apiRequest(`/topics/${topicId}/subtopics`);
}

export async function createSubTopic(topicId, subTopic) {
  return apiRequest(`/topics/${topicId}/subtopics`, {
    method: "POST",
    body: JSON.stringify(subTopic),
  });
}

/* Learning Materials */

export async function getLearningMaterials(subTopicId) {
  return apiRequest(`/subtopics/${subTopicId}/learning-materials`);
}

export async function createLearningMaterial(subTopicId, material) {
  return apiRequest(`/subtopics/${subTopicId}/learning-materials`, {
    method: "POST",
    body: JSON.stringify(material),
  });
}

/* AI Question Generation */

export async function generateQuestions(
  subTopicId,
  count = 3,
  difficulty = "medium",
) {
  const query = new URLSearchParams({
    count: String(count),
    difficulty,
  });

  return apiRequest(
    `/subtopics/${subTopicId}/questions/generate?${query.toString()}`,
    {
      method: "POST",
    },
  );
}

/* Assessment */

export async function createAssessmentSession(skillId, title = null) {
  const body = {
    skill_id: skillId,
  };

  if (title) {
    body.title = title;
  }

  return apiRequest("/assessments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getAssessment(assessmentId) {
  return apiRequest(`/assessments/${assessmentId}`);
}

export async function submitAssessment(assessmentId, answers) {
  return apiRequest(`/assessments/${assessmentId}/submit`, {
    method: "POST",
    body: JSON.stringify({
      answers,
    }),
  });
}

/* Diagnosis */

export async function getAssessmentDiagnosis(assessmentId) {
  return apiRequest(`/assessments/${assessmentId}/diagnosis`);
}

/* Remediation */

export async function getAssessmentRemediation(assessmentId) {
  return apiRequest(`/assessments/${assessmentId}/remediation`);
}

/* Targeted Re-test */

export async function createTargetedRetest(assessmentId) {
  return apiRequest(`/assessments/${assessmentId}/retest`, {
    method: "POST",
  });
}

/* Mastery */

export async function getSkillMastery(skillId) {
  return apiRequest(`/skills/${skillId}/mastery`);
}