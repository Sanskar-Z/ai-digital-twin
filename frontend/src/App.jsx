import { useState } from 'react'
import './index.css'

function Header() {
  return (
    <header style={{ background: '#5a00d3', color: 'white', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>AI-Powered Digital Twin</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/login" style={{ padding: '10px 20px', background: 'white', color: '#5a00d3', textDecoration: 'none', border: '2px solid #5a00d3', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s ease, color 0.3s ease' }}>
            Login
          </a>
          <a href="/signup" style={{ padding: '10px 20px', background: 'white', color: '#5a00d3', textDecoration: 'none', border: '2px solid #5a00d3', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s ease, color 0.3s ease' }}>
            Signup
          </a>
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
          <a href={feature.href} style={{ textDecoration: 'none', color: '#5a00d3', fontWeight: 'bold' }}>
            {feature.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

function DemoSection() {
  const [userInput, setUserInput] = useState('')
  const [output, setOutput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to your backend
    setOutput('Processing your request...')
  }

  return (
    <section id="demo">
      <h3 style={{ color: '#5a00d3' }}>Try It Out</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label htmlFor="userInput" style={{ fontWeight: 'bold' }}>
          Type your request (e.g., summarize an article):
        </label>
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your request here..."
          required
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            background: '#5a00d3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s ease, transform 0.2s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          Generate Response
        </button>
      </form>
      <div
        id="output"
        style={{
          marginTop: '20px',
          padding: '10px',
          background: '#e0eafc',
          border: '1px solid #5a00d3',
          borderRadius: '5px',
          minHeight: '50px'
        }}
      >
        {output}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px 0', background: '#5a00d3', color: 'white', borderRadius: '5px' }}>
      <p>&copy; 2025 Digital Twin Solutions</p>
    </footer>
  )
}

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, background: 'linear-gradient(to right, #e0eafc, #cfdef3)', color: '#333' }}>
      <Header />
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
        <DemoSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
