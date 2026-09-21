export function diagnoseAssessment(questions, answers) {
  const subTopicMap = {};

  questions.forEach((question) => {
    const key = `${question.topic}::${question.subTopic}`;

    if (!subTopicMap[key]) {
      subTopicMap[key] = {
        topic: question.topic,
        subTopic: question.subTopic,
        total: 0,
        correct: 0,
      };
    }

    subTopicMap[key].total += 1;

    if (answers[question.id] === question.correctAnswer) {
      subTopicMap[key].correct += 1;
    }
  });

  const subTopics = Object.values(subTopicMap).map((item) => {
    const accuracy = Math.round((item.correct / item.total) * 100);

    let status;

    if (accuracy >= 80) {
      status = "Strong";
    } else if (accuracy >= 60) {
      status = "Needs Practice";
    } else {
      status = "Weak";
    }

    return {
      ...item,
      accuracy,
      status,
    };
  });

  const weakAreas = subTopics.filter(
    (item) => item.status === "Weak",
  );

  const practiceAreas = subTopics.filter(
    (item) => item.status === "Needs Practice",
  );

  const strongAreas = subTopics.filter(
    (item) => item.status === "Strong",
  );

  return {
    subTopics,
    weakAreas,
    practiceAreas,
    strongAreas,
  };
}