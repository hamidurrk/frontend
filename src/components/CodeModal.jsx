import Modal from 'react-modal';

const CodeModal = ({ isOpen, onClose, codeData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Code Modal"
    >
      <h2>Code</h2>
      <pre>{codeData}</pre>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default CodeModal;
