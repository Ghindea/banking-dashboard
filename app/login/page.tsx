"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userId === "123") {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    } else {
      setError("Invalid user ID. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-georgel-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="ml-2 text-2xl font-bold">Georgel</span>
          </div>

          <h1 className="text-3xl font-bold">Log in</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium">
                User id
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your ID"
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <div className="text-sm text-gray-500 italic">Use "123" to log in</div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-georgel-purple hover:bg-georgel-purple/90 text-white font-semibold rounded-md"
            >
              Log in
            </button>
          </form>
        </div>
      </div>

      {/* Right side with device frame overlay */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-georgel-lightPurple relative">
        {/* Device frame that extends outside the container */}
        <div className="absolute right-[-5%] top-[10%] w-[85%] h-[80%] rounded-[20px] bg-white shadow-xl border-8 border-black overflow-hidden">
          {/* Frame content (dashboard preview) */}
          <div className="w-full h-full bg-black">
            {/* This would be your dashboard preview image */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PhJJFdrcTEAAinpmF8fbX0a5zxIDjZ.png"
              alt="Banking dashboard preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}