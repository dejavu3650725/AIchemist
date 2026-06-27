import React from 'react'
import './AppGrid.css'

function AppCard({ app, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault(); // Prevent navigating to the app URL
    onDelete(app.appId);
  }

  return (
    <a href={app.url} target="_blank" rel="noopener noreferrer" className="app-card">
      <button className="delete-btn" onClick={handleDelete} title="앱 삭제하기">
        🗑️
      </button>
      <div className="app-card-img">
        <img src={app.icon} alt={app.title} />
      </div>
      <div className="app-card-content">
        <h3>{app.title}</h3>
        <p className="app-description">{app.description}</p>
        <div className="app-tags">
          {app.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  )
}

function AppGrid({ apps, onDeleteApp }) {
  if (apps.length === 0) {
    return (
      <div className="empty-state">
        <p>등록된 앱이 없어요! 오른쪽 위 버튼을 눌러 새 앱을 추가해보세요 ✨</p>
      </div>
    )
  }

  return (
    <div className="app-grid">
      {apps.map((app) => (
        <AppCard key={app.appId} app={app} onDelete={onDeleteApp} />
      ))}
    </div>
  )
}

export default AppGrid
