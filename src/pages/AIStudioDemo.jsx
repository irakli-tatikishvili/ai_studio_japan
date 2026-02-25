import { useState } from 'react'
import {
  Sparkles,
  Send,
  Plus,
  Search,
  ChevronRight,
  MessageSquare,
  LayoutDashboard,
  Download,
  ClipboardList,
  Plug,
  BookOpen,
  Settings,
  Grid3X3,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useUsageLimits } from '../hooks/useUsageLimits'
import UpgradeModal from '../components/UpgradeModal'
import LimitWarningToast from '../components/LimitWarningToast'

export default function AIStudioDemo() {
  const [query, setQuery] = useState('')
  const [isDeepResearch, setIsDeepResearch] = useState(false)
  const [messages, setMessages] = useState([])
  const [activeMenu, setActiveMenu] = useState('ai-research')
  const { t, language } = useLanguage()
  const {
    performAction,
    showUpgradeModal,
    showLimitWarning,
    limitContext,
    closeUpgradeModal,
    closeLimitWarning,
  } = useUsageLimits()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    const metric = isDeepResearch ? 'deepResearch' : 'queries'
    const action = isDeepResearch ? 'run Deep Research' : 'send AI query'

    const success = performAction(metric, action, () => {
      setMessages((prev) => [
        ...prev,
        { type: 'user', content: query, isDeepResearch },
        {
          type: 'assistant',
          content: generateMockResponse(query, isDeepResearch, language),
          isDeepResearch,
        },
      ])
      setQuery('')
    })
  }

  const recentChats = [
    { title: 'Similarweb vs SEMrush & Ahrefs: Growth Moves', date: 'Modified December 30, 2025' },
  ]

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-sw-gray-100 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sw-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sw-dark rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-sw-dark">Data Studio</span>
              <span className="text-xs text-sw-gray-400 block">by Similarweb</span>
            </div>
            <button className="ml-auto text-sw-gray-400 hover:text-sw-gray-600">
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <SidebarItem
            icon={<Search className="w-4 h-4" />}
            label={t('sidebar.aiResearch')}
            active={activeMenu === 'ai-research'}
            onClick={() => setActiveMenu('ai-research')}
          />
          <SidebarItem
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={t('sidebar.aiDashboards')}
            hasArrow
            active={activeMenu === 'ai-dashboards'}
            onClick={() => setActiveMenu('ai-dashboards')}
          />
          <SidebarItem
            icon={<Download className="w-4 h-4" />}
            label={t('sidebar.dataExporter')}
            external
            active={activeMenu === 'data-exporter'}
            onClick={() => setActiveMenu('data-exporter')}
          />
          <SidebarItem
            icon={<ClipboardList className="w-4 h-4" />}
            label={t('sidebar.customReporting')}
            active={activeMenu === 'custom-reporting'}
            onClick={() => setActiveMenu('custom-reporting')}
          />
          <SidebarItem
            icon={<Plug className="w-4 h-4" />}
            label={t('sidebar.integrations')}
            active={activeMenu === 'integrations'}
            onClick={() => setActiveMenu('integrations')}
          />
        </nav>

        {/* Bottom Links */}
        <div className="p-2 border-t border-sw-gray-100">
          <SidebarItem
            icon={<BookOpen className="w-4 h-4" />}
            label={t('sidebar.apiDocs')}
            small
          />
          <SidebarItem
            icon={<Settings className="w-4 h-4" />}
            label={t('sidebar.settingsHelp')}
            small
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-sw-gray-50">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-12 px-4">
            {messages.length === 0 ? (
              <div className="text-center">
                <h1 className="text-3xl font-medium text-sw-blue-600 mb-8">
                  {t('studio.greeting', { name: 'Irakli' })}
                </h1>

                {/* Input Field */}
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="bg-white rounded-2xl border border-sw-gray-200 shadow-sm overflow-hidden">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('studio.enterPrompt')}
                      className="w-full px-5 py-4 text-sw-dark placeholder:text-sw-gray-400 focus:outline-none"
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-sw-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsDeepResearch(!isDeepResearch)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          isDeepResearch
                            ? 'bg-sw-blue-100 text-sw-blue-700'
                            : 'text-sw-gray-500 hover:bg-sw-gray-100'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <Search className="w-4 h-4" />
                        {t('limits.deepResearch')}
                      </button>
                      <button
                        type="submit"
                        disabled={!query.trim()}
                        className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 disabled:bg-sw-gray-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Quick Actions */}
                <div className="flex justify-center gap-3 mb-12">
                  {[t('studio.benchmarkPerformance'), t('studio.marketPulse'), t('studio.opportunityFinder')].map((action) => (
                    <button
                      key={action}
                      className="px-4 py-2 border border-sw-gray-200 rounded-full text-sm text-sw-gray-600 hover:border-sw-blue-300 hover:text-sw-blue-600 hover:bg-white transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>

                {/* Recent Chats */}
                <div className="text-left">
                  <h3 className="text-sm font-medium text-sw-dark mb-4">{t('studio.pickUpWhereYouLeft')}</h3>
                  <div className="space-y-2">
                    {recentChats.map((chat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-sw-gray-100 hover:border-sw-gray-200 transition-colors cursor-pointer"
                      >
                        <span className="text-sm text-sw-dark">{chat.title}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-sw-gray-400">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Chat
                          </span>
                          <span className="text-xs text-sw-gray-400">{chat.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl px-5 py-4 ${
                        message.type === 'user'
                          ? 'bg-sw-blue-600 text-white'
                          : 'bg-white border border-sw-gray-100 shadow-sm'
                      }`}
                    >
                      {message.isDeepResearch && message.type === 'user' && (
                        <div className="flex items-center gap-1.5 text-blue-200 text-xs mb-2">
                          <Search className="w-3 h-3" />
                          {t('limits.deepResearch')}
                        </div>
                      )}
                      <p className={message.type === 'user' ? '' : 'text-sw-gray-700 whitespace-pre-wrap'}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Input at bottom when there are messages */}
                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="bg-white rounded-2xl border border-sw-gray-200 shadow-sm overflow-hidden">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('studio.enterPrompt')}
                      className="w-full px-5 py-4 text-sw-dark placeholder:text-sw-gray-400 focus:outline-none"
                    />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-sw-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsDeepResearch(!isDeepResearch)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          isDeepResearch
                            ? 'bg-sw-blue-100 text-sw-blue-700'
                            : 'text-sw-gray-500 hover:bg-sw-gray-100'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <Search className="w-4 h-4" />
                        {t('limits.deepResearch')}
                      </button>
                      <button
                        type="submit"
                        disabled={!query.trim()}
                        className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 disabled:bg-sw-gray-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpgradeModal && (
        <UpgradeModal context={limitContext} onClose={closeUpgradeModal} />
      )}
      {showLimitWarning && (
        <LimitWarningToast context={limitContext} onClose={closeLimitWarning} />
      )}
    </div>
  )
}

function SidebarItem({ icon, label, active, hasArrow, external, small, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active
          ? 'bg-sw-blue-50 text-sw-blue-700'
          : small
          ? 'text-sw-gray-500 hover:text-sw-gray-700 hover:bg-sw-gray-50'
          : 'text-sw-gray-600 hover:bg-sw-gray-50'
      } ${small ? 'text-xs' : 'text-sm'}`}
    >
      <span className={active ? 'text-sw-blue-600' : 'text-sw-gray-400'}>{icon}</span>
      <span className="flex-1">{label}</span>
      {hasArrow && <ChevronRight className="w-4 h-4 text-sw-gray-400" />}
      {external && (
        <span className="w-4 h-4 text-sw-gray-300">↗</span>
      )}
    </button>
  )
}

function generateMockResponse(query, isDeepResearch, language) {
  if (language === 'ja') {
    if (isDeepResearch) {
      return `「${query.slice(0, 30)}...」に関する包括的な分析結果をお伝えします：\n\n1. 市場概要：業界は前年比15%成長しています\n2. 主要競合：市場シェアの異なる5つの主要プレーヤーを特定\n3. トラフィックトレンド：季節変動を伴う全体的な上昇傾向\n4. 推奨アクション：オーガニック成長とコンテンツ最適化に注力\n\n特定の分野をさらに詳しく調査しましょうか？`
    }
    return `素晴らしい質問です！Similarwebのデータに基づいて、「${query.slice(0, 20)}...」についてお答えします。主要指標は最適化の余地がある良好なトレンドを示しています。より具体的なデータが必要ですか、または包括的な分析のためにディープリサーチを実行しましょうか？`
  }

  if (isDeepResearch) {
    return `Based on my comprehensive analysis of your query "${query.slice(0, 50)}...", here are the key findings:\n\n1. Market Overview: The industry has seen 15% growth YoY\n2. Top Competitors: 5 key players identified with varying market shares\n3. Traffic Trends: Overall upward trajectory with seasonal variations\n4. Recommended Actions: Focus on organic growth and content optimization\n\nWould you like me to dive deeper into any specific area?`
  }
  return `Great question! Based on Similarweb data, I can help you understand "${query.slice(0, 30)}...". The key metrics show positive trends with room for optimization. Would you like me to provide more specific data or run a Deep Research for comprehensive analysis?`
}
