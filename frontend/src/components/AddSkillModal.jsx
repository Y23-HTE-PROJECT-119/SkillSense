import { useState } from "react";
import { createSkill } from "../services/api";

function AddSkillModal({ isOpen, onClose, onSkillCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newSkill = await createSkill({
        name: name.trim(),
        description: description.trim() || null,
      });

      setName("");
      setDescription("");
      onSkillCreated(newSkill);
      onClose();
    } catch (err) {
      console.error("Failed to create skill:", err);
      setError(err.message || "Failed to create skill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>+ Add New Skill</h3>
          <button type="button" className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="skill-name">
              Skill Name <span className="required-star">*</span>
            </label>
            <input
              id="skill-name"
              type="text"
              placeholder="e.g. Data Structures, Cloud Computing, Communication"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="skill-description">Description</label>
            <textarea
              id="skill-description"
              rows={3}
              placeholder="Brief summary of what this skill covers..."
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
              {submitting ? "Creating..." : "Create Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSkillModal;
