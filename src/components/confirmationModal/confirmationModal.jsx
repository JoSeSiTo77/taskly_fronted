import { FiAlertTriangle } from 'react-icons/fi'
import './confirmationModal.css'

function ConfirmationModal({ isConfirming, onCancel, onConfirm }) {
  return (
    <div className="confirmation-modal__backdrop" role="presentation">
      <section
        className="confirmation-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <span className="confirmation-modal__icon" aria-hidden="true">
          <FiAlertTriangle />
        </span>

        <h2 id="confirmation-modal-title">Are you sure?</h2>
        <p id="confirmation-modal-description">
          This action <strong>cannot be undone</strong>.
        </p>

        <div className="confirmation-modal__actions">
          <button
            className="confirmation-modal__button confirmation-modal__button--cancel"
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            className="confirmation-modal__button confirmation-modal__button--confirm"
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmationModal
