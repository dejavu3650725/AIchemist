import { useState, useEffect } from 'react'
import initialApps from './data/apps.json'
import Header from './components/Header'
import AppGrid from './components/AppGrid'
import AdminModal from './components/AdminModal'
import Footer from './components/Footer'
import PolicyModal from './components/PolicyModal'
import './App.css'

function App() {
  const [apps, setApps] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체 보기')
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [activePolicy, setActivePolicy] = useState(null) // 'terms' | 'privacy' | null

  const GNB_MENU = [
    {
      id: 'workspace',
      title: '🧪 연구실 (Workspace)',
      subMenus: ['학습지도', '생활지도']
    },
    {
      id: 'library',
      title: '📖 마법서 (Library)',
      subMenus: ['에듀테크', '로봇']
    },
    {
      id: 'gallery',
      title: '💎 연금술 조합소 (Gallery)',
      subMenus: ['수업&평가', '커뮤니티']
    },
    {
      id: 'resources',
      title: '🧰 도구함 (Resources)',
      subMenus: ['교육과정 매핑', '개발자 매뉴얼']
    },
    {
      id: 'mypage',
      title: '⚙️ 설정 (My Page)',
      subMenus: ['내 프로필', '문의하기']
    }
  ]

  // Load apps from JSON or LocalStorage on mount
  useEffect(() => {
    const savedApps = localStorage.getItem('aichemist_apps')
    if (savedApps) {
      setApps(JSON.parse(savedApps))
    } else {
      setApps(initialApps)
      localStorage.setItem('aichemist_apps', JSON.stringify(initialApps))
    }
  }, [])

  // Filter logic
  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === '전체 보기' || app.category === selectedCategory;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  })

  const handleAddApp = (newApp) => {
    const updatedApps = [...apps, newApp]
    setApps(updatedApps)
    localStorage.setItem('aichemist_apps', JSON.stringify(updatedApps))
  }

  const handleDeleteApp = (appId) => {
    const updatedApps = apps.filter(app => app.appId !== appId)
    setApps(updatedApps)
    localStorage.setItem('aichemist_apps', JSON.stringify(updatedApps))
  }

  return (
    <div className="portal-container">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAdmin={() => setIsAdminModalOpen(true)} 
      />
      
      <main className="portal-main">
        <aside className="portal-sidebar glass">
          <nav>
            <div className="sidebar-group">
              <button 
                className={`category-btn all-apps-btn ${selectedCategory === '전체 보기' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('전체 보기')}
              >
                🌌 전체 보기
              </button>
            </div>
            
            {GNB_MENU.map(menu => (
              <div key={menu.id} className="sidebar-group">
                <h3 className="sidebar-title">{menu.title}</h3>
                <ul className="sidebar-submenu">
                  {menu.subMenus.map(sub => (
                    <li key={sub}>
                      <button 
                        className={`submenu-btn ${selectedCategory === sub ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(sub)}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <section className="portal-content">
          <AppGrid apps={filteredApps} onDeleteApp={handleDeleteApp} />
        </section>
      </main>

      {isAdminModalOpen && (
        <AdminModal 
          onClose={() => setIsAdminModalOpen(false)} 
          onAdd={handleAddApp} 
        />
      )}

      {activePolicy && (
        <PolicyModal 
          type={activePolicy} 
          onClose={() => setActivePolicy(null)} 
        />
      )}

      <Footer onOpenPolicy={(type) => setActivePolicy(type)} />
    </div>
  )
}

export default App
