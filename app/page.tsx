"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

  useEffect(() => {
    const fetchWaitlistStats = async () => {
      try {
        const response = await fetch("/api/waitlist")
        if (response.ok) {
          const data = await response.json()
          setSignedUpCount(data.totalSignups || 0)
        }
      } catch (error) {
        console.error("Failed to fetch waitlist stats:", error)
      }
    }

    // Initial fetch
    fetchWaitlistStats()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchWaitlistStats, 30000)

    return () => clearInterval(interval)
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
          university: university.trim(),
          referralSource: "landing_page",
          sportsInterests: ["basketball", "football", "track"],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setIsSubmitted(true)
      setSignedUpCount((prev) => prev + 1)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-green-950 relative overflow-hidden">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl animate-bounce border-2 sm:border-4 border-white/20">
                <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text leading-none">
                  BRIXSPORTS
                </h1>
              </div>
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
                      {error && (
                        <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 md:p-4 text-red-200 text-center font-semibold text-sm md:text-base">
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
      <section className="relative z-10 py-12 md:py-16 bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 md:mb-8 text-white">Follow the Movement</h3>
            <div className="flex justify-center gap-6 md:gap-8">
              <a
                href="#"
                className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 md:p-5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-yellow-500/30 border-2 border-white/20"
                aria-label="Snapchat"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-yellow-400 font-black text-lg md:text-xl">👻</span>
                </div>
              </a>
              <a
                href="#"
                className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 md:p-5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-pink-500/30 border-2 border-white/20"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </a>
              <a
                href="#"
                className="bg-gradient-to-br from-gray-800 to-black p-4 md:p-5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-gray-500/30 border-2 border-white/20"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </a>
              <a
                href="mailto:hello@brixsports.com"
                className="bg-gradient-to-br from-blue-500 to-green-500 p-4 md:p-5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-blue-500/30 border-2 border-white/20"
                aria-label="Email"
              >
                <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16 border-t-2 border-blue-400/30 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl border-2 sm:border-4 border-white/20">
              <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
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
                href="mailto:hello@brixsports.com"
                className="hover:text-blue-400 transition-colors duration-300 font-semibold"
              >
                Contact: hello@brixsports.com
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
