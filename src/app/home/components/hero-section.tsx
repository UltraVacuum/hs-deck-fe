import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

export default function HeroSection() {

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              炉石传说卡组发现平台
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              发现强大的卡组，分析卡牌表现，掌握实时元数据趋势
              <br />
              <span className="text-lg text-gray-500">
                Discover powerful decks, analyze card performance, and master the meta
              </span>
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">智能分析</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">实时数据</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <span className="text-purple-700 font-medium">每日更新</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              立即开始
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              登录账号
            </Link>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">优质卡组</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">2K+</div>
              <div className="text-sm text-gray-600">卡牌分析</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">实时更新</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
}