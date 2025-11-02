import Link from 'next/link';
import {
    GithubIcon,
    TwitterIcon,
    MailIcon,
    Heart,
    Sparkles,
    Target,
    BarChart3,
    Layers
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white mt-20">
            {/* Top decoration */}
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">HsTopDecks</h3>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            专业的炉石传说卡组发现平台，为玩家提供最新的卡组分析、元数据洞察和策略建议。
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                className="text-gray-400 hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GithubIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                className="text-gray-400 hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <TwitterIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@hstopdecks.com"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <MailIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Features */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-blue-400" />
                            平台功能
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/cards" className="text-gray-300 hover:text-white transition-colors flex items-center">
                                    <Layers className="w-4 h-4 mr-2 text-gray-500" />
                                    卡牌数据库
                                </Link>
                            </li>
                            <li>
                                <Link href="/decks" className="text-gray-300 hover:text-white transition-colors flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                                    卡组构建器
                                </Link>
                            </li>
                            <li>
                                <Link href="/discovery" className="text-gray-300 hover:text-white transition-colors flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-gray-500" />
                                    发现实验室
                                </Link>
                            </li>
                            <li>
                                <Link href="/meta" className="text-gray-300 hover:text-white transition-colors flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                                    元数据分析
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">资源中心</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                                    最新资讯
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                                    关于我们
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="text-gray-300 hover:text-white transition-colors">
                                    新手指南
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-gray-300 hover:text-white transition-colors">
                                    社区讨论
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">法律信息</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                                    使用条款
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                                    隐私政策
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                                    Cookie政策
                                </Link>
                            </li>
                            <li>
                                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors">
                                    免责声明
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2024 HsTopDecks. 保留所有权利。
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                            <span>使用 </span>
                            <Heart className="w-4 h-4 mx-1 text-red-500" />
                            <span> 为炉石传说玩家精心打造</span>
                        </div>
                        <div className="text-gray-400 text-sm mt-4 md:mt-0">
                            <span>本站内容与暴雪娱乐官方无关</span>
                        </div>
                    </div>
                </div>

                {/* Hearthstone Themed Decoration */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/20">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-sm text-gray-300">Powered by Hearthstone® API</span>
                        <Sparkles className="w-4 h-4 ml-2 text-purple-400" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
