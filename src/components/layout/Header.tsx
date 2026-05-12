import { useNavigate } from "react-router"
import { FiLogOut, FiClock } from "react-icons/fi"
import { useAuthStore } from "../../stores/auth.store"
import { useLogout } from "../../hooks/useAuth"

export function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <header>
      <div>
        <FiClock />
        <span>Banana Meeting Rooms</span>
      </div>
      {isAuthenticated && (
        <button onClick={() => { logout(); navigate("/login") }}>
          <FiLogOut /> Sair
        </button>
      )}
    </header>
  )
}
