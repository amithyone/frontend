"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 lg:px-20 py-6 bg-transparent top-0 left-0 right-0 z-20 fixed">
      <div className="flex items-center">
        <img src="/public/icons/faddedsmsLogo.svg" alt="FaddedSMS Logo" className="h-8 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 rounded-full bg-white hover:bg-black/10 text-black font-medium transition-all duration-200"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-full bg-[#5DEBD7] text-black font-medium transition-all duration-200"
        >
          Sign in
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-black text-3xl z-30" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0B1120] bg-opacity-95 backdrop-blur-md shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-40 p-6 flex flex-col gap-6`}
      >
        <button className="text-white text-3xl self-end" onClick={() => setMenuOpen(false)}>
          ✖
        </button>
        <button
          onClick={() => {
            navigate("/register")
            setMenuOpen(false)
          }}
          className="w-full px-6 py-3 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200"
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            navigate("/login")
            setMenuOpen(false)
          }}
          className="w-full px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200"
        >
          Sign in
        </button>
      </div>
    </header>
  )
}
