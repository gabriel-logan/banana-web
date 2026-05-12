import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

export function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <form>
        <Input label="Email" name="email" type="email" />
        <Input label="Password" name="password" type="password" />
        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}
