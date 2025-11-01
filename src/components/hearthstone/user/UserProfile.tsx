'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { User as AuthUser } from '@supabase/supabase-js';
import { User, UserStats } from '@/types/hearthstone';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Trophy,
  Star,
  Heart,
  Eye,
  Settings,
  Camera,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface UserProfileProps {
  authUser: AuthUser | null;
  className?: string;
}

export default function UserProfile({ authUser, className = '' }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    favoriteClass: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (authUser) {
      loadUserProfile();
      loadUserStats();
    }
  }, [authUser]);

  const loadUserProfile = async () => {
    if (!authUser) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        setError('加载用户资料失败');
        return;
      }

      if (data) {
        setUser({
          id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '用户',
          username: authUser.user_metadata?.username || '',
          bio: authUser.user_metadata?.bio || '',
          avatar: authUser.user_metadata?.avatar_url || '',
          region: authUser.user_metadata?.region || '',
          battletag: authUser.user_metadata?.battletag || '',
          favoriteClass: authUser.user_metadata?.favorite_class ? {
            id: parseInt(authUser.user_metadata.favorite_class),
            name: authUser.user_metadata.favorite_class_name || '',
            slug: authUser.user_metadata.favorite_class,
            color: '#808080',
            heroClass: true,
            standard: true,
            wild: true,
            classic: true
          } : undefined,
          createdAt: new Date(authUser.created_at),
          lastActiveAt: new Date(),
          stats: data,
          achievements: [],
          following: 0,
          followers: 0
        });

        setUserStats(data);
        setEditForm({
          username: authUser.user_metadata?.username || '',
          bio: authUser.user_metadata?.bio || '',
          favoriteClass: authUser.user_metadata?.favorite_class || ''
        });
      } else {
        // Create default user profile
        const defaultUser: User = {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '用户',
          username: authUser.user_metadata?.username || '',
          bio: '',
          avatar: authUser.user_metadata?.avatar_url || '',
          region: '',
          battletag: '',
          favoriteClass: undefined,
          createdAt: new Date(authUser.created_at),
          lastActiveAt: new Date(),
          stats: {
            decksCreated: 0,
            decksShared: 0,
            totalGames: 0,
            overallWinRate: 50,
            favoriteFormat: 'standard',
            mostPlayedClass: undefined,
            achievements: 0,
            following: 0,
            followers: 0
          },
          achievements: [],
          following: 0,
          followers: 0
        };

        setUser(defaultUser);
        setUserStats(defaultUser.stats || null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!authUser) return;

    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (!error && data) {
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          username: editForm.username,
          bio: editForm.bio,
          favorite_class: editForm.favoriteClass
        }
      });

      if (metadataError) {
        throw metadataError;
      }

      // Update user statistics if needed
      if (!userStats) {
        const { error: statsError } = await supabase
          .from('user_statistics')
          .insert({
            user_id: authUser.id,
            decks_created: 0,
            decks_shared: 0,
            decks_copied: 0,
            cards_collected: 0,
            total_likes_received: 0,
            achievements_unlocked: 0,
            last_active_at: new Date().toISOString()
          });

        if (statsError) {
          throw statsError;
        }
      }

      // Update local state
      if (user) {
        setUser({
          ...user,
          username: editForm.username,
          bio: editForm.bio,
          favoriteClass: editForm.favoriteClass ? {
            id: parseInt(editForm.favoriteClass),
            name: editForm.favoriteClass,
            slug: editForm.favoriteClass,
            color: '#808080',
            heroClass: true,
            standard: true,
            wild: true,
            classic: true
          } : undefined
        });
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('保存资料失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        username: user.username || '',
        bio: user.bio || '',
        favoriteClass: user.favoriteClass?.slug || ''
      });
    }
    setIsEditing(false);
    setError('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
        <span className="text-gray-400">加载用户资料...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <UserIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">请先登录以查看用户资料</p>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400">@{user.username || 'user'}</p>
            {user.favoriteClass && (
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.favoriteClass.color }}
                />
                <span className="text-sm text-gray-300">{user.favoriteClass.name}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
          className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <XCircle className="w-4 h-4" />
              取消
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              编辑资料
            </>
          )}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">资料保存成功！</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Edit Form */}
      {isEditing ? (
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              placeholder="输入用户名..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none"
              rows={3}
              placeholder="介绍一下自己..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">最喜欢的职业</label>
            <select
              value={editForm.favoriteClass}
              onChange={(e) => setEditForm({ ...editForm, favoriteClass: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">选择职业</option>
              <option value="warrior">战士</option>
              <option value="mage">法师</option>
              <option value="hunter">猎人</option>
              <option value="druid">德鲁伊</option>
              <option value="warlock">术士</option>
              <option value="priest">牧师</option>
              <option value="rogue">潜行者</option>
              <option value="shaman">萨满祭司</option>
              <option value="paladin">圣骑士</option>
              <option value="demonhunter">恶魔猎手</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  保存
                </>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <p className="text-gray-300 italic">"{user.bio}"</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">创建卡组</span>
                <Trophy className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats?.decksCreated || 0}
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">分享卡组</span>
                <Star className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats?.decksShared || 0}
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">获得点赞</span>
                <Heart className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats?.totalLikesReceived || 0}
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">成就解锁</span>
                <Trophy className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {userStats?.achievements || 0}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>加入于 {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{authUser?.email}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}