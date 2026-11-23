import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ThreatTicker from './components/ThreatTicker'
import ProfileRFC from './components/ProfileRFC'
import MandatOperasional from './components/MandatOperasional'
import Advisories from './components/Advisories'
import IncidentForm from './components/IncidentForm'
import TicketTracker from './components/TicketTracker'
import GuidelinesFAQ from './components/GuidelinesFAQ'
import Footer from './components/Footer'
import PgpModal from './components/PgpModal'
import AdminDashboard from './components/AdminDashboard'

type View = 'public' | 'admin'

// Rute rahasia konsol SOC — tidak ditautkan dari halaman publik mana pun (lihat login.md)
const SOC_ROUTE = '/soc-control-wsh26'

function viewFromPath(): View {
  return window.location.pathname.replace(/\/+$/, '') === SOC_ROUTE ? 'admin' : 'public'
}

export default function App() {
  const [view, setView] = useState<View>(viewFromPath)
  const [pgpOpen, setPgpOpen] = useState(false)
  const [trackTicketId, setTrackTicketId] = useState<string | null>(null)

  useEffect(() => {
    const onPop = () => setView(viewFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path)
    setView(viewFromPath())
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const openPgp = useCallback(() => setPgpOpen(true), [])

  const trackTicket = useCallback((ticketId: string) => {
    setTrackTicketId(ticketId)
    requestAnimationFrame(() => {
      document.getElementById('lacak')?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  if (view === 'admin') {
    return <AdminDashboard onBack={() => navigate('/')} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero onOpenPgp={openPgp} />
        <ThreatTicker />
        <ProfileRFC onOpenPgp={openPgp} />
        <MandatOperasional />
        <Advisories />
        <IncidentForm onTrackTicket={trackTicket} />
        <TicketTracker prefillTicketId={trackTicketId} />
        <GuidelinesFAQ />
      </main>
      <Footer />
      <PgpModal open={pgpOpen} onClose={() => setPgpOpen(false)} />
    </div>
  )
}