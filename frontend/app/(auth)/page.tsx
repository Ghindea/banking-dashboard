"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import axios from "axios"

export default function LoginPage() {
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For admin login, we still send a hardcoded password
      const payload = {
        userId: userId,
        // Include an empty password field - backend will check if admin needs password
        password: userId === "admin" ? "1234" : ""
      }

      // Use axios to call your backend API
      const response = await axios.post('http://20.185.231.218:5000/login', payload)

      // Store the token and user info
      localStorage.setItem("accessToken", response.data.access_token)
      localStorage.setItem("userType", response.data.user_type)

      if (response.data.user_id) {
        localStorage.setItem("userId", response.data.user_id)
      }

      localStorage.setItem("isAuthenticated", "true")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid user ID. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-georgel-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="ml-2 font-bold text-xl">Georgel</span>
            </div>
            <h1 className="text-3xl font-bold">Log in</h1>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="userId" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your ID"
                className="h-12"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                <p>Enter "admin" for admin access or a valid client ID.</p>
                <p>Try <span className="font-mono">10001</span> for a sample client ID.</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-georgel-purple hover:bg-georgel-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-georgel-lightPurple">
        <div className="relative w-[370px] h-[600px]">
          {/* Device frame */}
          <div className="absolute inset-0 rounded-[30px] border-8 border-black bg-white overflow-hidden shadow-xl">
            {/* Dashboard preview image */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PhJJFdrcTEAAinpmF8fbX0a5zxIDjZ.png"
              alt="Dashboard preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}