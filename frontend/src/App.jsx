import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import EmailReply from './components/EmailReply'
import NewsSummaries from './components/NewsSummaries'
import CalendarManagement from './components/CalendarManagement'
import ResearchAssistance from './components/ResearchAssistance'
import Login from './components/Login'
import Signup from './components/Signup'

function Header() {
  return (
    <header style={{ background: '#5a00d3', color: 'white', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>AI-Powered Digital Twin</h1>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" style={{ padding: '10px 20px', background: 'white', color: '#5a00d3', textDecoration: 'none', border: '2px solid #5a00d3', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s ease, color 0.3s ease' }}>
            Login
          </Link>
          <Link to="/signup" style={{ padding: '10px 20px', background: 'white', color: '#5a00d3', textDecoration: 'none', border: '2px solid #5a00d3', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s ease, color 0.3s ease' }}>
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
    { title: 'News Summaries', href: '/news-summaries' },
    { title: 'Calendar Management', href: '/calendar-management' },
    { title: 'Research Assistance', href: '/research-assistance' }
  ]

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {features.map((feature, index) => (
        <li key={index} style={{ background: '#e0eafc', margin: '5px 0', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Link to={feature.href} style={{ textDecoration: 'none', color: '#5a00d3', fontWeight: 'bold' }}>
            {feature.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Home() {
  return (
    <main style={{ maxWidth: '800px', margin: '20px auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <section>
        <h2 style={{ color: '#5a00d3' }}>Welcome to Your Digital Twin</h2>
        <p>
          Your AI clone adapts to your browsing habits, tone, and decision-making to assist with tasks like email replies, scheduling, and research.
        </p>
      </section>
      <section>
        <h3 style={{ color: '#5a00d3' }}>Features</h3>
        <FeatureList />
      </section>
    </main>
  )
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, background: 'linear-gradient(to right, #e0eafc, #cfdef3)', color: '#333' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/email-reply" element={<EmailReply />} />
          <Route path="/news-summaries" element={<NewsSummaries />} />
          <Route path="/calendar-management" element={<CalendarManagement />} />
          <Route path="/research-assistance" element={<ResearchAssistance />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
