import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
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

          <form className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="userId" className="text-sm font-medium">
                User id
              </label>
              <Input id="userId" type="text" placeholder="Enter your id" className="h-12" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link href="#" className="text-sm font-medium text-georgel-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="Enter your password" className="h-12" />
            </div>

            <Link href="/dashboard">
              <Button className="w-full h-12 bg-georgel-purple hover:bg-georgel-purple/90">Log in</Button>
            </Link>
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
