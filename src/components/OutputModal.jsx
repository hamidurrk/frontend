import Modal from 'react-modal';

const OutputModal = ({ isOpen, onClose, outputData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Output Modal"
    >
      <h2>Output</h2>
      <pre>{outputData}</pre>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default OutputModal;
