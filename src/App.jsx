import { useState, useEffect } from 'react'
import initialApps from './data/apps.json'
import Header from './components/Header'
import AppGrid from './components/AppGrid'
import AdminModal from './components/AdminModal'
import './App.css'

function App() {
  const [apps, setApps] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체 보기')
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  const GNB_MENU = [
    {
      id: 'workspace',
      title: '🧪 연구실 (Workspace)',
      subMenus: ['새 수업 설계하기', '단계별 치트키', '최근 작업 내역']
    },
    {
      id: 'library',
      title: '📖 마법서 (Library)',
      subMenus: ['내 수업 보관함', '프로젝트 폴더 관리', '휴지통']
    },
    {
      id: 'gallery',
      title: '💎 연금술 조합소 (Gallery)',
      subMenus: ['우수 수업 레시피', '교사 커뮤니티', '프롬프트 팁']
    },
    {
      id: 'resources',
      title: '🧰 도구함 (Resources)',
      subMenus: ['교과 성취기준 맵핑', '로봇/교구 매뉴얼', '블록 코딩 튜토리얼']
    },
    {
      id: 'mypage',
      title: '⚙️ 설정 (My Page)',
      subMenus: ['내 프로필', '구독/크레딧 관리', '문의하기']
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
    </div>
  )
}

export default App
