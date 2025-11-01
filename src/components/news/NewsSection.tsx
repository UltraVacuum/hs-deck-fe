'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsArticle } from '@/services/news-data-service';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NewsSectionProps {
  articles?: NewsArticle[];
  loading?: boolean;
  maxItems?: number;
  showMoreLink?: boolean;
}

const contentTypeLabels = {
  'patch': { label: '版本补丁', color: 'destructive' as const },
  'balance': { label: '平衡调整', color: 'default' as const },
  'expansion': { label: '扩展包', color: 'secondary' as const },
  'event': { label: '活动赛事', color: 'outline' as const },
  'update': { label: '游戏更新', color: 'default' as const }
};

export default function NewsSection({
  articles = [],
  loading = false,
  maxItems = 5,
  showMoreLink = true
}: NewsSectionProps) {
  const [displayArticles, setDisplayArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setDisplayArticles(articles.slice(0, maxItems));
  }, [articles, maxItems]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">最新资讯</h2>
        {[...Array(maxItems)].map((_, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">暂无最新资讯</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">最新资讯</h2>
        {showMoreLink && (
          <Link href="/news">
            <Button variant="outline" size="sm">
              查看更多
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {displayArticles.map((article, index) => (
          <Card
            key={article.id}
            className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={contentTypeLabels[article.contentType].color}>
                      {contentTypeLabels[article.contentType].label}
                    </Badge>
                    {article.affectedClasses.length > 0 && (
                      <span className="text-sm text-gray-400">
                        影响: {article.affectedClasses.join(', ')}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white mb-2 line-clamp-2">
                    <Link
                      href={`/news/${article.slug}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    {article.sourceName} • {formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                      locale: zhCN
                    })}
                  </CardDescription>
                </div>
                {index === 0 && (
                  <Badge variant="destructive" className="shrink-0">
                    最新
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-gray-300 line-clamp-3 mb-4">
                {article.summary}
              </p>

              {article.relatedCardIds.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span>相关卡牌:</span>
                  <span className="text-blue-400">
                    {article.relatedCardIds.length} 张
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {article.metaKeywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/news/${article.slug}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  阅读更多 →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showMoreLink && articles.length > maxItems && (
        <div className="text-center pt-4">
          <Link href="/news">
            <Button variant="outline" size="lg">
              查看所有资讯 ({articles.length} 篇)
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}