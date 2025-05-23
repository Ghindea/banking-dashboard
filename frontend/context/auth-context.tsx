"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

type User = {
	id: string
	type: "admin" | "client"
	token: string
}

type AuthContextType = {
	user: User | null
	login: (userId: string, password?: string) => Promise<void>
	logout: () => void
	isLoading: boolean
	error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	// Check if user is already logged in
	useEffect(() => {
		const token = localStorage.getItem("accessToken")
		const userType = localStorage.getItem("userType")
		const userId = localStorage.getItem("userId")
		const isAuthenticated = localStorage.getItem("isAuthenticated")

		if (token && isAuthenticated === "true" && userType) {
			setUser({
				id: userId || "unknown",
				type: userType as "admin" | "client",
				token
			})
		}

		setIsLoading(false)
	}, [])

	// Set up axios interceptor for adding token to requests
	useEffect(() => {
		const interceptor = axios.interceptors.request.use(
			(config) => {
				if (user?.token) {
					config.headers.Authorization = `Bearer ${user.token}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		// Clean up the interceptor when the component unmounts
		return () => {
			axios.interceptors.request.eject(interceptor)
		}
	}, [user])

	const login = async (userId: string, password?: string) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await axios.post('http://20.185.231.218:5000/login', {
				userId,
				password
			})

			const token = response.data.access_token
			const userType = response.data.user_type
			const id = response.data.user_id || userId

			// Store in localStorage
			localStorage.setItem("accessToken", token)
			localStorage.setItem("userType", userType)
			localStorage.setItem("userId", id)
			localStorage.setItem("isAuthenticated", "true")

			// Update context
			setUser({
				id,
				type: userType,
				token
			})

			// Redirect to dashboard
			router.push("/dashboard")
		} catch (error) {
			console.error("Login error:", error)
			setError("Invalid credentials. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	const logout = () => {
		// Clear stored data
		localStorage.removeItem("accessToken")
		localStorage.removeItem("userType")
		localStorage.removeItem("userId")
		localStorage.removeItem("isAuthenticated")

		// Update context
		setUser(null)

		// Redirect to login
		router.push("/login")
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}