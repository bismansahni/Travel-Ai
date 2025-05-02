import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Enter your credentials to access your account."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/sign-up"
    >
      <SignInForm />
    </AuthLayout>
  )
}
