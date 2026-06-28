import { useState, useEffect } from 'react'
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase'
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
  const [editingApp, setEditingApp] = useState(null)
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

  // Load apps from Firestore on mount
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const appsCol = collection(db, 'apps')
        const appSnapshot = await getDocs(appsCol)
        
        if (appSnapshot.empty) {
          // 파이어베이스가 비어있으면 초기 데이터 밀어넣기 (Seeding)
          for (const app of initialApps) {
            await setDoc(doc(db, 'apps', app.appId), app)
          }
          setApps(initialApps)
        } else {
          // Firestore에서 불러오기
          const appList = appSnapshot.docs.map(docSnap => ({ 
            ...docSnap.data(), 
            appId: docSnap.id 
          }))
          setApps(appList)
        }
      } catch (err) {
        console.error("🔥 Firebase 로드 실패:", err)
        // 에러 시 로컬 스토리지로 폴백
        const savedApps = localStorage.getItem('aichemist_apps')
        if (savedApps) setApps(JSON.parse(savedApps))
        else setApps(initialApps)
      }
    }
    fetchApps()
  }, [])

  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === '전체 보기' || app.category === selectedCategory;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  })

  // Gemini 비서(Vercel 서버리스 함수) 호출용 뼈대 함수
  const askGemini = async (promptText) => {
    try {
      const res = await fetch('/api/gemini-aichemist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      return data.result
    } catch (err) {
      console.error('Gemini 호출 실패:', err)
      return null
    }
  }

  const handleAddApp = async (newApp) => {
    try {
      await setDoc(doc(db, 'apps', newApp.appId), newApp)
      setApps([...apps, newApp])
    } catch (err) {
      console.error("앱 등록 실패:", err)
    }
  }

  const handleEditApp = async (updatedApp) => {
    try {
      await setDoc(doc(db, 'apps', updatedApp.appId), updatedApp)
      setApps(apps.map(app => app.appId === updatedApp.appId ? updatedApp : app))
    } catch (err) {
      console.error("앱 수정 실패:", err)
    }
  }

  const openAddModal = () => {
    setEditingApp(null)
    setIsAdminModalOpen(true)
  }

  const openEditModal = (app) => {
    setEditingApp(app)
    setIsAdminModalOpen(true)
  }

  const handleDeleteApp = async (appId) => {
    try {
      await deleteDoc(doc(db, 'apps', appId))
      setApps(apps.filter(app => app.appId !== appId))
    } catch (err) {
      console.error("앱 삭제 실패:", err)
    }
  }

  return (
    <div className="portal-container">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAdmin={openAddModal} 
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
          <AppGrid apps={filteredApps} onEditApp={openEditModal} onDeleteApp={handleDeleteApp} />
        </section>
      </main>

      {isAdminModalOpen && (
        <AdminModal 
          editingApp={editingApp}
          onClose={() => setIsAdminModalOpen(false)} 
          onAdd={handleAddApp} 
          onEdit={handleEditApp}
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
