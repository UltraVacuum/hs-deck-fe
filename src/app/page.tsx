import Link from 'next/link'

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Hearthstone Deck Discovery
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover powerful decks, analyze card performance, and stay ahead of the meta with our comprehensive platform.
                    </p>
                    <div className="space-x-4">
                        <Link
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
