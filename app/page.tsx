"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, ArrowRight, Zap, Loader2 } from "lucide-react"

export default function BrixsportsWaitlist() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
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
    if (!email || !name) return

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-orange-950 relative overflow-hidden">
      <div className="fixed inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-2 bg-gradient-to-b from-white/30 via-orange-400/20 to-red-500/30 animate-pulse"
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
          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse"
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
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl animate-bounce border-2 sm:border-4 border-white/20">
                <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text leading-none">
                  BRIXSPORTS
                </h1>
              </div>
            </div>

            <div className="mb-6 md:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-orange-600/30 via-red-600/30 to-yellow-600/30 rounded-2xl md:rounded-3xl border-2 border-white/30 backdrop-blur-md shadow-2xl">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight">
                COURT • PITCH • TRACK
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-200 font-bold">
                Your Campus. Your Game. Your Victory.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-yellow-200 mt-2">
                Built for ballers, football legends, and track champions.
              </p>
            </div>

            {signedUpCount > 0 && (
              <div className="mb-6 md:mb-8 bg-black/60 backdrop-blur-md border-2 border-orange-400/40 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                <div className="text-center">
                  <div className="space-y-2 md:space-y-3 group hover:scale-110 transition-transform duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-orange-400 animate-pulse" />
                      <span className="text-xs sm:text-sm font-black text-white">ATHLETES READY</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-bold">LIVE</span>
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                      {signedUpCount.toLocaleString()}+
                    </div>
                    <div className="text-xs sm:text-sm text-orange-400 font-bold">🏆 GAME ON!</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-400/30">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
                  Be the first to know when BRIXSPORTS launches
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-400 font-black">
                  Be a part of the movement
                </p>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-orange-200 max-w-3xl mx-auto font-semibold px-4">
                Join the ultimate platform that connects basketball, football, and track athletes across Nigeria. Track
                your performance stats, connect with your teams, and dominate every game, match, and race on your
                campus.
              </p>
            </div>

            {!isSubmitted ? (
              <Card className="max-w-lg mx-auto bg-black/70 backdrop-blur-md border-2 border-orange-400/50 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 mx-4 sm:mx-auto">
                <CardContent className="p-6 sm:p-8 md:p-10">
                  <div className="text-center mb-6 md:mb-8">
                    <div className="text-4xl sm:text-6xl mb-3 md:mb-4">🏆</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">
                      JOIN THE TEAM
                    </h3>
                    <p className="text-sm sm:text-base text-orange-200 font-semibold">
                      Get exclusive early access when we launch on your campus
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-black/50 border-2 border-orange-400/50 focus:border-orange-400 focus:ring-orange-400/50 text-white placeholder:text-orange-200/70 text-lg md:text-xl py-3 md:py-4 rounded-xl"
                      required
                      disabled={isLoading}
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/50 border-2 border-orange-400/50 focus:border-orange-400 focus:ring-orange-400/50 text-white placeholder:text-orange-200/70 text-lg md:text-xl py-3 md:py-4 rounded-xl"
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
                      className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white font-black py-4 md:py-5 text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-2xl rounded-xl border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            ) : (
              <Card className="max-w-lg mx-auto bg-black/70 backdrop-blur-md border-2 border-green-400/50 shadow-2xl mx-4 sm:mx-auto">
                <CardContent className="p-6 sm:p-8 md:p-10 text-center">
                  <div className="text-6xl sm:text-7xl md:text-8xl mb-4 md:mb-6">🏆</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">
                    WELCOME TO THE TEAM!
                  </h3>
                  <p className="text-green-200 text-base md:text-lg font-semibold mb-3 md:mb-4">
                    You're officially part of the BRIXSPORTS movement. Get ready for game day!
                  </p>
                  <p className="text-green-300 text-sm font-semibold break-words">
                    Thanks {name}! We'll notify you at {email} when we launch.
                  </p>
                </CardContent>
              </Card>
            )}

            {signedUpCount > 0 && (
              <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-4 text-sm sm:text-base md:text-lg text-orange-200 bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-orange-400/30 mx-4 sm:mx-0">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 animate-bounce" />
                <span className="font-bold text-center">
                  <span className="hidden sm:inline">
                    Join {signedUpCount.toLocaleString()}+ athletes already at the starting line
                  </span>
                  <span className="sm:hidden">{signedUpCount.toLocaleString()}+ athletes ready!</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-white">
              CHAMPIONSHIP FEATURES
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-orange-200 max-w-3xl mx-auto font-semibold px-4">
              Everything you need to excel in basketball, football, and track - all seamlessly integrated into one
              lightning-fast platform designed for Nigerian athletes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-orange-400/40 hover:border-orange-400 group hover:scale-110 hover:rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">🏀</div>
                <h3 className="text-2xl font-black mb-6 text-white">GAME STATS</h3>
                <p className="text-orange-200 text-lg mb-6 font-semibold">
                  Track points, assists, goals, and sprint times with precision. Get real-time updates that matter most
                  for basketball, football, and track performance.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-orange-500/80 text-white border-orange-400/60 font-bold">Live Stats</Badge>
                  <Badge className="bg-red-500/80 text-white border-red-400/60 font-bold">Records</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-red-400/40 hover:border-red-400 group hover:scale-110 hover:-rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">⚽</div>
                <h3 className="text-2xl font-black mb-6 text-white">TEAM CONNECT</h3>
                <p className="text-red-200 text-lg mb-6 font-semibold">
                  Connect seamlessly with your basketball squad, football team, or track club. Share winning strategies
                  and build the championship bonds that last.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-red-500/80 text-white border-red-400/60 font-bold">Team Chat</Badge>
                  <Badge className="bg-yellow-500/80 text-black border-yellow-400/60 font-bold">Schedules</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 bg-black/60 backdrop-blur-md border-2 border-yellow-400/40 hover:border-yellow-400 group hover:scale-110 hover:rotate-1">
              <CardContent className="p-10">
                <div className="text-8xl mb-6">🏃‍♂️</div>
                <h3 className="text-2xl font-black mb-6 text-white">RECRUITMENT HUB</h3>
                <p className="text-yellow-200 text-lg mb-6 font-semibold">
                  Get discovered by top coaches across basketball, football, and track disciplines. Showcase your best
                  highlights and connect with life-changing opportunities.
                </p>
                <div className="flex justify-center gap-3 text-sm">
                  <Badge className="bg-yellow-500/80 text-black border-yellow-400/60 font-bold">Highlights</Badge>
                  <Badge className="bg-green-500/80 text-white border-green-400/60 font-bold">Scouting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 md:py-20 bg-gradient-to-r from-orange-900/60 via-red-900/60 to-yellow-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-white">
              BUILT FOR BALLERS, LEGENDS & CHAMPIONS
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-orange-200 max-w-3xl mx-auto font-semibold px-4">
              From casual pickup games to university championships - connecting basketball, football, and track athletes
              across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <Card className="bg-black/60 backdrop-blur-md border-2 border-orange-400/50 hover:border-orange-400 transition-all duration-500 hover:scale-105 hover:rotate-1">
              <CardContent className="p-6 md:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                  <div className="text-4xl sm:text-6xl">🏀</div>
                  <div className="flex-1">
                    <h3 className="font-black mb-3 md:mb-4 text-white text-xl md:text-2xl">RECREATIONAL LEAGUES</h3>
                    <p className="text-orange-200 text-base md:text-lg mb-3 md:mb-4 font-semibold">
                      Join exciting intramural basketball leagues, discover pickup football matches, and connect with
                      dedicated track running groups right here on your campus.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                      <span className="bg-orange-500/80 px-2 md:px-3 py-1 md:py-2 rounded-lg text-white font-bold">
                        Pickup Games
                      </span>
                      <span className="bg-red-500/80 px-2 md:px-3 py-1 md:py-2 rounded-lg text-white font-bold">
                        Intramurals
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-md border-2 border-red-400/50 hover:border-red-400 transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-6 md:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                  <div className="text-4xl sm:text-6xl">⚽</div>
                  <div className="flex-1">
                    <h3 className="font-black mb-3 md:mb-4 text-white text-xl md:text-2xl">UNIVERSITY ATHLETICS</h3>
                    <p className="text-red-200 text-base md:text-lg mb-4 md:mb-6 font-semibold">
                      Follow your university's basketball, football, and track teams with pride. Get live scores,
                      detailed match results, and connect directly with elite campus athletes.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                      <span className="bg-red-500/80 px-2 md:px-3 py-1 md:py-2 rounded-lg text-white font-bold">
                        Live Scores
                      </span>
                      <span className="bg-yellow-500/80 px-2 md:px-3 py-1 md:py-2 rounded-lg text-white font-bold">
                        Match Results
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 md:py-16 border-t-2 border-orange-400/30 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl border-2 border-white/20">
              <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <span className="font-black text-2xl sm:text-3xl md:text-4xl text-white">BRIXSPORTS</span>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-orange-200 mb-3 md:mb-4 font-bold px-4">
            Where championship shots are made • Where winning goals are scored • Where record-breaking times are set
          </p>
          <p className="text-xs sm:text-sm text-white/70 font-semibold px-4">
            Proudly built for Nigerian ballers, football legends, and track champions.
          </p>
        </div>
      </footer>
    </div>
  )
}
