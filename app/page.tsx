import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Signin Card Component - Shows benefits for each user type
interface SigninCardProps {
  person: string
  pitch: string
  href: string
}

function SigninCard({ person, pitch, href }: SigninCardProps) {
  return (
    <Card hover className="w-full max-w-md text-center cursor-default">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">{person}</h2>
      <p className="text-base leading-relaxed text-gray-600 mb-7 whitespace-pre-line">
        {pitch}
      </p>
      <div className="flex flex-col items-center gap-3">
        <Link href={href} className="w-full max-w-xs">
          <Button variant="primary" fullWidth>
            Sign up
          </Button>
        </Link>
        <Link href="/login" className="w-full max-w-xs">
          <Button variant="secondary" fullWidth>
            Log in
          </Button>
        </Link>
      </div>
    </Card>
  )
}

// Feature Card Component - Highlights platform features
interface FeatureCardProps {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-slate-900/5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:border-blue-700/10 p-6 text-center flex-1 m-4 min-w-[260px]">
      <h2 className="text-2xl text-blue-700 font-bold mb-3">{title}</h2>
      <p className="text-base text-gray-900 leading-6 m-0">{description}</p>
    </div>
  )
}

// Description Section - Explains what Sponsorlink is
function Description() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-100 rounded-3xl max-w-[1100px] mx-auto my-10 text-center px-8 py-12 pb-16 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-3 relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:mt-2 after:mx-auto after:rounded-full after:bg-gradient-to-r after:from-blue-600 after:to-blue-400">
        What is Sponsorlink?
      </h2>
      <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto mb-10">
        Sponsorlink is a next-generation platform that connects organizers and sponsors
        seamlessly. Whether you&apos;re hosting hackathons, school events, or community projects,
        Sponsorlink helps ideas meet the right support.
      </p>

      <div className="flex flex-wrap justify-center gap-9 mt-8 mb-3">
        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white to-blue-100 shadow-md hover:shadow-xl p-6 flex flex-col items-center justify-center text-center border border-blue-700/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
          <h3 className="text-blue-700 font-bold mb-2 text-lg">For Organizers</h3>
          <p className="text-sm text-slate-800 leading-6">
            Showcase your projects, gain visibility, and attract sponsors who share your vision.
          </p>
        </div>

        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white to-blue-100 shadow-md hover:shadow-xl p-6 flex flex-col items-center justify-center text-center border border-blue-700/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
          <h3 className="text-blue-700 font-bold mb-2 text-lg">For Sponsors</h3>
          <p className="text-sm text-slate-800 leading-6">
            Discover creative initiatives and invest in fresh ideas that align with your brand.
          </p>
        </div>

        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white to-blue-100 shadow-md hover:shadow-xl p-6 flex flex-col items-center justify-center text-center border border-blue-700/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
          <h3 className="text-blue-700 font-bold mb-2 text-lg">Community Impact</h3>
          <p className="text-sm text-slate-800 leading-6">
            Each connection builds innovation, learning, and long-term positive impact.
          </p>
        </div>
      </div>
    </section>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  const sponsorpitch = `You're not just throwing logos around.
You want impact, alignment, and real reach.
Forget the spam calls.
Find projects that deserve your brand.
Log in and make it happen.`

  const organizerpitch = `You're not just chasing sponsors.
You're tired of cold calls and no replies.
Forget the long waits and empty promises.
Find brands that believe in your vision.
Log in and make it happen.`

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 to-cyan-50 text-slate-900 p-5 overflow-x-hidden">
      <div className="relative z-10">
        {/* Welcome Section */}
        <section className="mb-16 flex justify-center px-4 py-10">
          <div className="flex items-center justify-between gap-9 max-w-[1100px] w-full p-10 rounded-3xl bg-white/70 backdrop-blur-2xl shadow-lg hover:shadow-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
            {/* Hero Image Placeholder */}
            <div className="flex-[0_0_42%] max-w-md hidden md:block">
              <div className="w-full h-[400px] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-white text-6xl font-bold">SL</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 flex flex-col justify-center z-10 text-center md:text-left">
              <h1 className="text-5xl font-extrabold m-0 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight leading-tight transition-all duration-300 hover:scale-105">
                Welcome to Sponsorlink
              </h1>
              <p className="mt-3 text-slate-800 text-xl leading-snug font-medium">
                Connect organizers with sponsors and bring projects to life — fast, simple, and visible.
              </p>
            </div>
          </div>
        </section>

        {/* Signin Card Grid */}
        <section className="flex flex-wrap justify-center max-w-[1100px] mx-auto mb-16 gap-4 px-3">
          <SigninCard
            person="I am a Sponsor"
            pitch={sponsorpitch}
            href="/signup?type=sponsor"
          />
          <SigninCard
            person="I am an Organizer"
            pitch={organizerpitch}
            href="/signup?type=organizer"
          />
        </section>

        {/* Description */}
        <Description />

        {/* Feature Card Grid */}
        <section className="flex flex-wrap justify-center max-w-[1100px] mx-auto mt-16 gap-5 px-4 -m-4">
          <FeatureCard
            title="Showcase Your Vision"
            description="Turn your projects into standout events that get noticed. From hackathons to pitch nights, Sponsorlink makes it simple for organizers to shine and for sponsors to discover the next big idea."
          />
          <FeatureCard
            title="Connect with Sponsors"
            description="Connect with sponsors who are ready to back great ideas. Build meaningful collaborations, gain visibility, and turn your sponsorships into real impact — it's networking done right."
          />
          <FeatureCard
            title="Effortless Experience"
            description="Manage your projects, sponsorships, and connections with a sleek interface designed for clarity and speed. Everything you need, from browsing opportunities to posting updates, is just a click away."
          />
        </section>
      </div>
    </div>
  )
}