import Navigation from "@/components/local/navigation";
import HeroSection from './components/hero-section';
import MetaDashboard from '../meta/page';
import NewsSection from "@/components/news/NewsSection";

export default function Home() {

  return (
    <div className="relative bg-gray-50">
      <Navigation />

      {/* New Hearthstone-themed sections */}
      <HeroSection />

      {/* Meta Dashboard Section - Integrated with light background */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                实时元数据分析
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              深入了解当前环境，发现制胜策略 | Deep dive into current meta trends and discover winning strategies
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                实时更新 | Live Updates
              </span>
              <span className="text-sm text-gray-500">
                数据更新于 {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <MetaDashboard />
        </div>
      </div>

      {/* Latest News Section - Moved to end */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                最新资讯
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              获取最新的炉石传说游戏更新、平衡调整和扩展包信息 | Stay updated with the latest Hearthstone news, balance changes, and expansions
            </p>
          </div>
          <NewsSection
            articles={[]}
            maxItems={8}
            showMoreLink={true}
          />
        </div>
      </div>
    </div>
  );
}
