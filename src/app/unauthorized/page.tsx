"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex justify-center">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          We couldn’t verify this sign-in attempt.  
          If this wasn’t you, your account is safe — no action is needed.  
          If it was you, please try signing in again.
        </p>
        <Link href="/sign-in">
          <Button className="w-full">Go to Sign In</Button>
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a>
      </p>
    </div>
  )
}
