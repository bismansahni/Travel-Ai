import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Sign up to start planning your next adventure."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/sign-in"
    >
      <SignUpForm />
    </AuthLayout>
  )
}
