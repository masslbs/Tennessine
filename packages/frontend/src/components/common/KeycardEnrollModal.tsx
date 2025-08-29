import { useIsOwner, useKeycard } from "@massmarket/react-hooks";
import Modal from "./Modal.tsx";

export default function KeycardEnrollModal() {
  const { isOwner } = useIsOwner();
  const { isLoading } = useKeycard();
  if (!isLoading || !isOwner) return null;

  return (
    <Modal>
      <h2 className="mb-4">Enrolling your keycard...</h2>
      <p>
        Please sign your keycard to continue.
      </p>
    </Modal>
  );
}
