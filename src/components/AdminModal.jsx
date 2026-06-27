import React, { useState } from 'react'
import './AdminModal.css'

function AdminModal({ onClose, onAdd }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    url: '',
    category: '어학',
    tags: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    // Hardcoded MVP admin password
    if (password === 'admin1234') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('비밀번호가 틀렸당께요!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newApp = {
      appId: `app-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: formData.icon || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80',
      url: formData.url,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    onAdd(newApp)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {!isAuthenticated ? (
          <div className="admin-login">
            <h2>🔒 관리자 인증</h2>
            <p>앱을 등록하려면 코드를 입력하쇼!</p>
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                placeholder="비밀번호 (admin1234)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-dark">인증하기</button>
            </form>
          </div>
        ) : (
          <div className="admin-form">
            <h2>✨ 새 학습 앱 등록</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>카테고리</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="어학">어학</option>
                  <option value="수학">수학</option>
                  <option value="과학">과학</option>
                  <option value="프로그래밍">프로그래밍</option>
                  <option value="생산성">생산성</option>
                </select>
              </div>

              <div className="form-group">
                <label>앱 이름 (Title)</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="예: 영단어 퀴즈"
                />
              </div>

              <div className="form-group">
                <label>앱 주소 (URL)</label>
                <input 
                  type="url" 
                  required 
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>설명 (Description)</label>
                <textarea 
                  required 
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="이 앱은 어떤 앱인가요?"
                />
              </div>

              <div className="form-group">
                <label>태그 (쉼표로 구분)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="예: 영어, 퀴즈, 토익"
                />
              </div>

              <div className="form-group">
                <label>썸네일 이미지 URL (선택)</label>
                <input 
                  type="url" 
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="이미지 주소가 없으면 기본 이미지가 들어갑니다."
                />
              </div>

              <button type="submit" className="btn-dark">등록하기 🚀</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminModal
