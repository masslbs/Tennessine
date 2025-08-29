import Button from "./Button.tsx";
import Modal from "./Modal.tsx";

export default function OrderWarningModal(
  { showModal, proceed, reset }: {
    showModal: boolean;
    proceed: () => void;
    reset: () => void;
  },
) {
  if (!showModal) return null;

  return (
    <Modal>
      <h2 className="mb-4">Before you leave...</h2>
      <p>If you leave this page, your items will no longer be reserved.</p>
      <section className="mt-5">
        <Button onClick={() => reset()}>
          Continue checkout
        </Button>
        <Button onClick={proceed}>
          Back to shop
        </Button>
      </section>
    </Modal>
  );
}
