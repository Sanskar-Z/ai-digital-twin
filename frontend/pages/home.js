import React, { useState } from "react";

const Home = () => {
    const [userInput, setUserInput] = useState("");
    const [output, setOutput] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        setOutput(`AI Response for: "${userInput}"`);
        setUserInput(""); 
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0, background: "linear-gradient(to right, #e0eafc, #cfdef3)", color: "#333" }}>
            <header style={{ background: "#5a00d3", color: "white", padding: "20px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{ margin: 0, fontSize: "2rem" }}>AI-Powered Digital Twin</h1>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <a href="/login" style={linkStyle}>Login</a>
                        <a href="/signup" style={linkStyle}>Signup</a>
                    </div>
                </nav>
            </header>
            <main style={mainStyle}>
                <section>
                    <h2 style={{ color: "#5a00d3" }}>Welcome to Your Digital Twin</h2>
                    <p>
                        Your AI clone adapts to your browsing habits, tone, and decision-making to assist with tasks like email replies, scheduling, and research.
                    </p>
                </section>
                <section>
                    <h3 style={{ color: "#5a00d3" }}>Features</h3>
                    <ul style={listStyle}>
                        <li style={listItemStyle}>
                            <a href="/email-reply" style={featureLinkStyle}>Email Reply Generation</a>
                        </li>
                        <li style={listItemStyle}>
                            <a href="/news-summaries" style={featureLinkStyle}>News Summaries</a>
                        </li>
                        <li style={listItemStyle}>
                            <a href="/calendar-management" style={featureLinkStyle}>Calendar Management</a>
                        </li>
                        <li style={listItemStyle}>
                            <a href="/research-assistance" style={featureLinkStyle}>Research Assistance</a>
                        </li>
                    </ul>
                </section>
                <section id="demo">
                    <h3 style={{ color: "#5a00d3" }}>Try It Out</h3>
                    <form onSubmit={handleFormSubmit} style={formStyle}>
                        <label htmlFor="userInput" style={{ fontWeight: "bold" }}>Type your request (e.g., summarize an article):</label>
                        <input
                            type="text"
                            id="userInput"
                            placeholder="Enter your request here..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Generate Response</button>
                    </form>
                    <div id="output" style={outputStyle}>{output}</div>
                </section>
            </main>
            <footer style={footerStyle}>
                <p>&copy; 2025 Digital Twin Solutions</p>
            </footer>
        </div>
    );
};

const linkStyle = {
    padding: "10px 20px",
    background: "white",
    color: "#5a00d3",
    textDecoration: "none",
    border: "2px solid #5a00d3",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background 0.3s ease, color 0.3s ease",
};

const mainStyle = {
    maxWidth: "800px",
    margin: "20px auto",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const listStyle = {
    listStyle: "none",
    padding: 0,
};

const listItemStyle = {
    background: "#e0eafc",
    margin: "5px 0",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const featureLinkStyle = {
    textDecoration: "none",
    color: "#5a00d3",
    fontWeight: "bold",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
};

const buttonStyle = {
    padding: "10px",
    background: "#5a00d3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const outputStyle = {
    marginTop: "20px",
    padding: "10px",
    background: "#e0eafc",
    border: "1px solid #5a00d3",
    borderRadius: "5px",
    minHeight: "50px",
};

const footerStyle = {
    textAlign: "center",
    marginTop: "20px",
    padding: "10px 0",
    background: "#5a00d3",
    color: "white",
    borderRadius: "5px",
};

export default Home;