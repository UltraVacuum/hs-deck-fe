


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface News {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  image_url: string;
  published_at: string;
  category: string;
  source_url: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news?page=1&page_size=4&sort_by=published_at&sort_order=desc');
        const data = await response.json();
        setNews(data.data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
        <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <article key={item.id} className="group">
            <div className="relative overflow-hidden rounded-lg mb-3">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            
            <div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                {item.category}
              </span>
              
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.excerpt}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {item.author}</span>
                <span>{formatDate(item.published_at)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


