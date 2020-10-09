import React from 'react';
import ModalPortal from './ModalPortal';

const Modal = ({ onClose }) => {
    return (
        <div className="Modal">
            <div className="content">
                <p>Hello</p>
                <button onClick={onClose}>close</button>
            </div>
        </div>
    );
};

export default Modal;
