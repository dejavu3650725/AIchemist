import React, { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import './AdminModal.css'

function AdminModal({ editingApp, onClose, onAdd, onEdit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState(editingApp ? {
    title: editingApp.title,
    description: editingApp.description,
    icon: editingApp.icon,
    url: editingApp.url,
    category: editingApp.category || '학습지도',
    tags: editingApp.tags.join(', ')
  } : {
    title: '',
    description: '',
    icon: '',
    url: '',
    category: '학습지도',
    tags: ''
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // 로그인 성공 시 구글 사용자 정보를 이용할 수도 있지만, 일단은 인증 성공 처리만 합니다.
      setIsAuthenticated(true)
      setError('')
    } catch (error) {
      console.error("구글 로그인 에러:", error)
      setError('구글 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingApp) {
      const updatedApp = {
        ...editingApp,
        title: formData.title,
        description: formData.description,
        icon: formData.icon || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80',
        url: formData.url,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }
      onEdit(updatedApp)
    } else {
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
    }

    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {!isAuthenticated ? (
          <div className="admin-login">
            <h2>🔒 인증이 필요합니다</h2>
            <p>앱을 등록하거나 수정하려면 구글 계정으로 로그인하세요.</p>
            <div className="login-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleLogin} className="btn-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google 계정으로 계속하기
              </button>
              {error && <p className="error-msg">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="admin-form">
            <h2>{editingApp ? "✨ 앱 정보 수정" : "✨ 새 앱 등록"}</h2>
            <form onSubmit={handleSubmit}>

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
                <label>카테고리</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="학습지도">학습지도</option>
                  <option value="생활지도">생활지도</option>
                  <option value="에듀테크">에듀테크</option>
                  <option value="로봇">로봇</option>
                  <option value="수업&평가">수업&평가</option>
                  <option value="커뮤니티">커뮤니티</option>
                  <option value="교육과정 매핑">교육과정 매핑</option>
                  <option value="개발자 매뉴얼">개발자 매뉴얼</option>
                </select>
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
                <label>썸네일 이미지 (선택)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.icon && (
                  <img 
                    src={formData.icon} 
                    alt="미리보기" 
                    style={{ marginTop: '10px', maxWidth: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                )}
              </div>

              <button type="submit" className="btn-dark">
                {editingApp ? "수정하기 🚀" : "등록하기 🚀"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminModal
