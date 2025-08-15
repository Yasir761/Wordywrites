import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex justify-center items-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
            card: "shadow-xl border border-gray-200 rounded-xl p-6",
            headerTitle: "text-2xl font-semibold text-gray-800",
            headerSubtitle: "text-sm text-gray-500",
            formFieldInput:
              "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
          },
          variables: {
            colorPrimary: "#4f46e5",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard" // 👈 force redirect after sign-in
      />
    </div>
  );
}
