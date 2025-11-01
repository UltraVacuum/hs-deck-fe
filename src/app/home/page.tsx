import Link from 'next/link'
import HeroSection from './components/hero-section';

export default function Home() {

  return (
    <div className="relative bg-gray-50">
      {/* New Hearthstone-themed sections */}
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
    </div>
  );
}