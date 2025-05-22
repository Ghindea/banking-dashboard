"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios" // You'll need to install axios

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
      // Create payload (special handling for admin)
      const payload = {
        userId: userId,
        password: userId === "admin" ? "1234" : ""
      }

      // Call the backend API
      const response = await axios.post('http://localhost:3000/login', payload)
      
      // Store auth data
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
              <div className="text-sm text-gray-500 italic">
                Enter "admin" or a valid client ID like "10001"
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-georgel-purple hover:bg-georgel-purple/90 text-white font-semibold rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
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
              src="/dashboard-preview.png"
              alt="Banking dashboard preview"
              className="w-full h-full object-cover"
              style={{
                objectFit: "cover",
                objectPosition: "0% center",
                transform: "scale(1.05)", // Slightly enlarge the image
                transformOrigin: "left center" // Scale from the left side
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}