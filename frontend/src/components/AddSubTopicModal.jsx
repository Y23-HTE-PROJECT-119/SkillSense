import { useState } from "react";
import { createSubTopic } from "../services/api";

function AddSubTopicModal({ isOpen, onClose, topic, onSubTopicCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !topic) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Sub-topic name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newSubTopic = await createSubTopic(topic.id, {
        name: name.trim(),
        description: description.trim() || null,
      });

      setName("");
      setDescription("");
      onSubTopicCreated(topic.id, newSubTopic);
      onClose();
    } catch (err) {
      console.error("Failed to create sub-topic:", err);
      setError(err.message || "Failed to create sub-topic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>+ Add Sub-topic to "{topic.name}"</h3>
          <button type="button" className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="subtopic-name">
              Sub-topic Name <span className="required-star">*</span>
            </label>
            <input
              id="subtopic-name"
              type="text"
              placeholder="e.g. if-else Statements, For Loops, Recursion"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtopic-description">Description</label>
            <textarea
              id="subtopic-description"
              rows={3}
              placeholder="Brief summary of what this sub-topic covers..."
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
              {submitting ? "Creating..." : "Create Sub-topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubTopicModal;
