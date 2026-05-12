import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

export function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <Input label="Email" name="email" type="email" />
        <Input label="Password" name="password" type="password" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}
