function Alert({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-popup">
        <p>{message}</p>
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;