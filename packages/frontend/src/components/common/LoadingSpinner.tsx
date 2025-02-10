import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div>
      <ClipLoader
        loading={true}
        size={40}
        data-testid="loader"
      />
    </div>
  );
}
