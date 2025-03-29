import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import EmailReply from './components/EmailReply'
import NewsSummaries from './components/NewsSummaries'
import CalendarManagement from './components/CalendarManagement'
import ResearchAssistance from './components/ResearchAssistance'
import Login from './components/Login'
import Signup from './components/Signup'
import EmailSummarize from './components/EmailSummarize'

function Header() {
  return (
    <header style={{ background: '#6200ea', color: 'white', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>AI-Powered Digital Twin</h1>
        </Link>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/login" style={{ padding: '10px 20px', background: 'white', color: '#6200ea', textDecoration: 'none', border: '2px solid #6200ea', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s ease' }}>
            Login
          </Link>
          <Link to="/signup" style={{ padding: '10px 20px', background: 'white', color: '#6200ea', textDecoration: 'none', border: '2px solid #6200ea', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s ease' }}>
            Signup
          </Link>
        </div>
      </nav>
    </header>
  )
}

function FeatureList() {
  const features = [
    { title: 'Email Reply Generation', href: '/email-reply' },
    { title: 'Email Summarization', href: '/email-summarize' },
    { title: 'News Summaries', href: '/news-summaries' },
    { title: 'Calendar Management', href: '/calendar-management' },
    { title: 'Research Assistance', href: '/research-assistance' }
  ]

  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {features.map((feature, index) => (
        <li key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s ease' }}>
          <Link to={feature.href} style={{ textDecoration: 'none', color: '#6200ea', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {feature.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Home() {
  return (
    <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <section>
        <h2 style={{ color: '#6200ea', fontSize: '2rem', marginBottom: '10px' }}>Welcome to Your Digital Twin</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          Your AI clone adapts to your browsing habits, tone, and decision-making to assist with tasks like email replies, scheduling, and research.
        </p>
      </section>
      <section>
        <h3 style={{ color: '#6200ea', fontSize: '1.5rem', marginTop: '20px' }}>Features</h3>
        <FeatureList />
      </section>
    </main>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#6200ea', color: 'white', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
      <p style={{ margin: 0, fontSize: '1rem' }}>&copy; {new Date().getFullYear()} Code Crusaders. All rights reserved.</p>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', margin: 0, padding: 0, background: '#f8f9fa', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/email-reply" element={<EmailReply />} />
            <Route path="/email-summarize" element={<EmailSummarize />} />
            <Route path="/news-summaries" element={<NewsSummaries />} />
            <Route path="/calendar-management" element={<CalendarManagement />} />
            <Route path="/research-assistance" element={<ResearchAssistance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
