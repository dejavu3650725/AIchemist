import React from 'react'
import './Header.css'

function Header({ searchQuery, setSearchQuery, onOpenAdmin }) {
  return (
    <header className="portal-header glass">
      <div className="header-logo">
        <span className="logo-icon">⚡</span>
        <h1>AIchemist</h1>
      </div>
      
      <div className="header-search">
        <input 
          type="text" 
          placeholder="Search apps by name or keyword..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="header-actions">
        <button className="btn-dark" onClick={onOpenAdmin} title="새 앱 등록하기">
          + 새 앱 추가
        </button>
      </div>
    </header>
  )
}

export default Header
