import React from 'react';

function Modal({ title, children, onClose }) {
    const handleClose = (e) => {
        if (e.target === e.currentTarget) { // Close modal on clicking outside
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content">
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default Modal;