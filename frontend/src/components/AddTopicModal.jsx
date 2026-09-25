import { useState } from "react";
import { createTopic } from "../services/api";

function AddTopicModal({ isOpen, onClose, skillId, onTopicCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Topic name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newTopic = await createTopic(skillId, {
        name: name.trim(),
        description: description.trim() || null,
      });

      setName("");
      setDescription("");
      onTopicCreated(newTopic);
      onClose();
    } catch (err) {
      console.error("Failed to create topic:", err);
      setError(err.message || "Failed to create topic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>+ Add Topic</h3>
          <button type="button" className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="topic-name">
              Topic Name <span className="required-star">*</span>
            </label>
            <input
              id="topic-name"
              type="text"
              placeholder="e.g. Control Flow, Object-Oriented Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic-description">Description</label>
            <textarea
              id="topic-description"
              rows={3}
              placeholder="Brief summary of what this topic covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-modal-button"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTopicModal;
