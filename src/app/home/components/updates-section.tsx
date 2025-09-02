'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Update {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
  impact_level: string;
  affected_classes: string[];
  source_url: string;
}

export default function UpdatesSection() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const response = await fetch('/api/updates?page=1&page_size=3&sort_by=release_date&sort_order=desc');
        const data = await response.json();
        setUpdates(data.data || []);
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUpdates();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImpactColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Major': 'bg-red-100 text-red-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Minor': 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Game Updates</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
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
        <h2 className="text-2xl font-bold text-gray-800">Game Updates</h2>
        <Link href="/updates" className="text-blue-600 hover:text-blue-800 font-medium">
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                v{update.version}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(update.impact_level)}`}>
                {update.impact_level}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-1">
              <a href={update.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                {update.title}
              </a>
            </h3>

            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {update.description}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                {update.affected_classes && update.affected_classes.length > 0 && (
                  <>Affected: {update.affected_classes.join(', ')}</>
                )}
              </span>
              <span>{formatDate(update.release_date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


