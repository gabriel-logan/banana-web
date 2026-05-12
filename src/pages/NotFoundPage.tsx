import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { FiHome } from "react-icons/fi";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <Button onClick={() => navigate("/")}>
        <FiHome /> Go home
      </Button>
    </div>
  );
}
