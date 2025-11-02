import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';

import DeckBuilder from '@/components/hearthstone/decks/DeckBuilder';
import UserProfile from '@/components/hearthstone/user/UserProfile';
import Navigation from '@/components/local/navigation';

// 禁用静态生成，因为需要认证信息
export const dynamic = 'force-dynamic';

export default async function DecksPage() {
  const supabase = createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* User Profile Sidebar */}
            <div className="lg:col-span-1">
              <UserProfile authUser={user} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">卡组构建器</h1>
                <p className="text-xl text-gray-600">
                  创建属于你的完美卡组
                </p>
              </div>

              <DeckBuilder
                format="standard"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
