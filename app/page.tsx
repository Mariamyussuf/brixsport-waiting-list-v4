"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, ArrowRight, Zap, Loader2, Mail, Instagram, Twitter } from "lucide-react"

export default function BrixsportsWaitlist() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [university, setUniversity] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signedUpCount, setSignedUpCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fetchWaitlistStats = async () => {
      try {
        const response = await fetch("/api/waitlist")
        if (response.ok) {
          const data = await response.json()
          setSignedUpCount(data.totalSignups || 0)
        } else {
          // Handle error response but don't show it to user
          console.error("Failed to fetch waitlist stats:", response.status)
        }
      } catch (error) {
        console.error("Failed to fetch waitlist stats:", error)
        // Don't show error to user, just use default count of 0
      }
    }

    // Handle scroll effect for navbar
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    // Initial fetch
    fetchWaitlistStats()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchWaitlistStats, 30000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !university) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          university: university.trim(),
          referralSource: "landing_page",
          sportsInterests: ["basketball", "football", "track"],
        }),
      })

      const data = await response.json()

      // Handle 409 Conflict (email already registered) as a success case
      if (response.status === 409) {
        setIsSubmitted(true)
        // Don't increment the count for already registered users
        setError("🎊 You're already on our waitlist! We'll be in touch soon. Get ready for an epic sports journey! 🎉");
        return
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setIsSubmitted(true)
      setSignedUpCount((prev) => prev + 1)
      // Add a success message
      setError("🎉 Success! You're on the Brixsports waitlist. Get ready for an epic sports journey! 🏆")
    } catch (error) {
      console.error("Waitlist submission error:", error)
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-green-950 relative overflow-hidden">
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md border-b border-blue-400/50 shadow-xl py-3' 
          : 'bg-black/80 backdrop-blur-md border-b border-blue-400/30 shadow-lg py-4'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image 
                src="/BRIX-SPORT-LOGO.png" 
                alt="Brixsports Logo" 
                width={48} 
                height={48} 
                className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-105"
              />
              <span className="text-2xl font-black text-white tracking-tighter">BRIXSPORTS</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="fixed inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-2 bg-gradient-to-b from-white/30 via-blue-400/20 to-green-500/30 animate-pulse"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-blue-500/10 animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
      </div>

      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.1) 80px, rgba(255,255,255,0.1) 82px),
              repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,165,0,0.1) 120px, rgba(255,165,0,0.1) 122px)
            `,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-16 lg:py-24">
          <div className="text-center max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text leading-none">
                BRIXSPORTS
              </h1>
            </div>

            <div className="mb-6 md:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600/30 via-green-600/30 to-blue-600/30 rounded-2xl md:rounded-3xl border-2 border-white/30 backdrop-blur-md shadow-2xl">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight">
                COURT • PITCH • TRACK
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-200 font-bold">
                Your Campus. Your Game. Your Victory.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-green-200 mt-2">
                Built for athletes, fans, and everyone who loves the game.
              </p>
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/50">
                <p className="text-sm sm:text-base md:text-lg text-orange-200 font-bold">
                  🚀 Launching first at Bells University of Technology
                </p>
              </div>
            </div>

            {signedUpCount > 0 && (
              <div className="mb-6 md:mb-8 bg-black/60 backdrop-blur-md border-2 border-blue-400/40 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                <div className="text-center">
                  <div className="space-y-2 md:space-y-3 group hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-400 animate-pulse" />
                      <span className="text-xs sm:text-sm font-black text-white">COMMUNITY READY</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-bold">LIVE</span>
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                      {signedUpCount.toLocaleString()}+
                    </div>
                    <div className="text-xs sm:text-sm text-blue-400 font-bold">🏆 GAME ON!</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-400/50 animate-pulse">
                  <p className="text-lg sm:text-xl md:text-2xl font-black text-red-300">
                    ⚡ Be one of the first 1000 to sign up ⚡
                  </p>
                  <p className="text-sm text-red-200 font-semibold">Limited early access spots available</p>
                </div>

                {isSubmitted ? (
                  <Card className="max-w-lg mx-auto bg-gradient-to-br from-green-500/20 via-blue-500/20 to-green-600/20 backdrop-blur-md border-2 border-green-400/50 shadow-2xl hover:shadow-green-500/30 transition-all duration-500 mx-4 sm:mx-auto animate-pulse">
                    <CardContent className="p-6 sm:p-8 md:p-10 text-center">
                      <div className="text-6xl mb-4 animate-bounce">🎉</div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 animate-pulse">
                        WELCOME TO THE TEAM!
                      </h3>
                      <p className="text-lg sm:text-xl text-green-200 font-bold mb-6">
                        You're officially on the Brixsports waitlist! 🏆
                      </p>
                      <p className="text-base sm:text-lg text-blue-200 mb-6">
                        Get ready for an epic sports journey. We'll be in touch soon with exclusive updates and early access!
                      </p>
                      <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-4 border border-yellow-400/50">
                        <p className="text-yellow-200 font-bold">
                          🚀 You're among the first to know when we launch!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="max-w-lg mx-auto bg-black/70 backdrop-blur-md border-2 border-blue-400/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 mx-4 sm:mx-auto">
                    <CardContent className="p-6 sm:p-8 md:p-10">
                      <div className="text-center mb-6 md:mb-8">
                        <div className="text-4xl sm:text-6xl mb-3 md:mb-4">🏆</div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">
                          JOIN THE TEAM
                        </h3>
                        <p className="text-sm sm:text-base text-blue-200 font-semibold">
                          Get exclusive early access when we launch on your campus
                        </p>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-black/50 border-2 border-blue-400/50 focus:border-blue-400 focus:ring-blue-400/50 text-white placeholder:text-blue-200/70 text-lg md:text-xl py-3 md:py-4 rounded-xl"
                          required
                          disabled={isLoading}
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-black/50 border-2 border-blue-400/50 focus:border-blue-400 focus:ring-blue-400/50 text-white placeholder:text-blue-200/70 text-lg md:text-xl py-3 md:py-4 rounded-xl"
                          required
                          disabled={isLoading}
                        />
                        <Input
                          type="text"
                          placeholder="Your University"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          className="bg-black/50 border-2 border-green-400/50 focus:border-green-400 focus:ring-green-400/50 text-white placeholder:text-green-200/70 text-lg md:text-xl py-3 md:py-4 rounded-xl"
                          required
                          disabled={isLoading}
                        />
                        {error && !isSubmitted && (
                          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-400/50 rounded-xl p-3 md:p-4 text-green-200 text-center font-bold text-sm md:text-base animate-pulse">
                            {error}
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-600 hover:from-blue-600 hover:via-green-600 hover:to-blue-700 text-white font-black py-4 md:py-5 text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 shadow-2xl rounded-xl border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                              <span className="hidden sm:inline">JOINING THE TEAM...</span>
                              <span className="sm:hidden">JOINING...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                              <span className="hidden sm:inline">SPRINT TO THE FRONT</span>
                              <span className="sm:hidden">JOIN NOW</span>
                              <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {signedUpCount > 0 && (
              <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-4 text-sm sm:text-base md:text-lg text-blue-200 bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-400/30 mx-4 sm:mx-0">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-green-400 animate-bounce" />
                <span className="font-bold text-center">
                  <span className="hidden sm:inline">
                    Join {signedUpCount.toLocaleString()}+ sports enthusiasts already at the starting line
                  </span>
                  <span className="sm:hidden">{signedUpCount.toLocaleString()}+ community ready!</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 md:py-20 lg:py-32 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-white">
              CHAMPIONSHIP FEATURES
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto font-semibold px-4">
              Everything athletes and fans need to connect with basketball, football, and track - all seamlessly
              integrated into one lightning-fast platform designed for the Nigerian sports community
            </p>
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-400/30 max-w-2xl mx-auto">
              <p className="text-base sm:text-lg text-orange-200 font-semibold">
                Starting at Bells University of Technology and expanding across Nigerian campuses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-blue-400/40 hover:border-blue-400 group hover:scale-110 hover:rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">🏀</div>
                <h3 className="text-2xl font-black mb-6 text-white">GAME STATS</h3>
                <p className="text-blue-200 text-lg mb-6 font-semibold">
                  Track points, assists, goals, and sprint times with precision. Get real-time updates that matter most
                  for basketball, football, and track performance.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-blue-500/80 text-white border-blue-400/60 font-bold">Live Stats</Badge>
                  <Badge className="bg-green-500/80 text-white border-green-400/60 font-bold">Records</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-green-400/40 hover:border-green-400 group hover:scale-110 hover:-rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">⚽</div>
                <h3 className="text-2xl font-black mb-6 text-white">TEAM CONNECT</h3>
                <p className="text-green-200 text-lg mb-6 font-semibold">
                  Connect seamlessly with your basketball squad, football team, or track club. Share winning strategies
                  and build the championship bonds that last.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-green-500/80 text-white border-green-400/60 font-bold">Team Chat</Badge>
                  <Badge className="bg-blue-500/80 text-white border-blue-400/60 font-bold">Schedules</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-blue-400/40 hover:border-blue-400 group hover:scale-110 hover:rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-2xl font-black mb-6 text-white">FAN ZONE</h3>
                <p className="text-blue-200 text-lg mb-6 font-semibold">
                  Cheer for your favorite teams and players across basketball, football, and track. Get exclusive
                  behind-the-scenes content and connect with fellow fans who share your passion.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-blue-500/80 text-white border-blue-400/60 font-bold">Fan Content</Badge>
                  <Badge className="bg-green-500/80 text-white border-green-400/60 font-bold">Community</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-12 md:py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-white">What is Brixsports?</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-semibold leading-relaxed">
              Brixsports is where campus sports come alive. Built for Nigerian students, athletes, and fans, we bring
              real-time match logging, live scores, and athlete highlights straight to your fingertips. Whether you're
              playing on the court, pitch, or track, or cheering from the stands, Brixsports is your home for campus
              sports.
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="relative z-10 py-8 md:py-12 bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 md:mb-6 text-white">Follow the Movement</h3>
            <div className="flex justify-center gap-4 md:gap-6">
              <a
                href="https://snapchat.com/add/brixsports"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 md:p-4 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-yellow-500/30 border-2 border-white/20"
                aria-label="Follow Brixsports on Snapchat"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.958 1.404-5.958s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001.017.001z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/brixsports"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 md:p-4 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-pink-500/30 border-2 border-white/20"
                aria-label="Follow Brixsports on Instagram"
              >
                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </a>
              <a
                href="https://tiktok.com/@brixsports"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-black to-red-600 p-3 md:p-4 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-red-500/30 border-2 border-white/20"
                aria-label="Follow Brixsports on TikTok"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://x.com/brixsports"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-gray-800 to-black p-3 md:p-4 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-gray-500/30 border-2 border-white/20"
                aria-label="Follow Brixsports on X"
              >
                <Twitter className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </a>
              <a
                href="mailto:brixsports2025@gmail.com"
                className="bg-gradient-to-br from-blue-500 to-green-500 p-3 md:p-4 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/30 border-2 border-white/20"
                aria-label="Email Brixsports"
              >
                <Mail className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16 border-t-2 border-blue-400/30 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 md:mb-8">
            <span className="font-black text-2xl sm:text-3xl md:text-4xl text-white">BRIXSPORTS</span>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-blue-200 mb-4 md:mb-6 font-bold px-4">
            Where championship shots are made • Where winning goals are scored • Where record-breaking times are set
          </p>
          <div className="space-y-3 md:space-y-4">
            <p className="text-xs sm:text-sm text-white/70 font-semibold px-4">
              Proudly built for Nigerian athletes, fans, and sports enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-white/60">
              <a
                href="mailto:brixsports2025@gmail.com"
                className="hover:text-blue-400 transition-colors duration-300 font-semibold"
              >
                Contact: brixsports2025@gmail.com
              </a>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold">© 2025 Brixsports. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
