import HeroSection from './home/components/hero-section';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="relative bg-gray-50">
      {/* Hero Section - 保留原始hero组件 */}
      <HeroSection />

      {/* Simple CTA Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              开始探索炉石传说
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              发现强大的卡组，分析卡牌表现，在元数据中保持领先
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                立即开始
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-colors"
              >
                登录账号
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              平台特色
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              专业的炉石传说数据分析平台，助你成为更优秀的玩家
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600 text-2xl">📊</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">实时数据分析</h3>
              <p className="text-gray-600">获取最新的卡组胜率、使用率和趋势分析</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-green-600 text-2xl">🎯</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">智能卡组推荐</h3>
              <p className="text-gray-600">基于AI算法为你推荐最适合当前环境的卡组</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-purple-600 text-2xl">⚔️</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">对局分析</h3>
              <p className="text-gray-600">详细的职业对局数据和 matchup 分析</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
