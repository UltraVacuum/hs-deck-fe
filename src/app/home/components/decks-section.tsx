

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Deck {
  id: string;
  deck_name: string;
  deck_class: string;
  deck_code: string;
  win_rate: number;
  popularity: number;
  dust_cost: number;
  archetype: string;
  tier: string;
}

export default function DecksSection() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const response = await fetch('/api/decks?page=1&page_size=6&sort_by=popularity&sort_order=desc');
        const data = await response.json();
        setDecks(data.data || []);
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDecks();
  }, []);

  const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
      'Paladin': 'bg-yellow-100 text-yellow-800',
      'Warrior': 'bg-red-100 text-red-800',
      'Mage': 'bg-blue-100 text-blue-800',
      'Priest': 'bg-white text-gray-800',
      'Druid': 'bg-orange-100 text-orange-800',
      'Rogue': 'bg-black text-white',
      'Shaman': 'bg-purple-100 text-purple-800',
      'Warlock': 'bg-pink-100 text-pink-800',
      'Hunter': 'bg-green-100 text-green-800',
      'Demon Hunter': 'bg-gray-100 text-gray-800'
    };
    return colors[className] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Popular Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-4 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popular Decks</h2>
        <Link href="/decks" className="text-blue-600 hover:text-blue-800 font-medium">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <div key={deck.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 truncate">{deck.deck_name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassColor(deck.deck_class)}`}>
                {deck.deck_class}
              </span>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-medium text-green-600">{deck.win_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Popularity:</span>
                <span className="font-medium">{deck.popularity}%</span>
              </div>
              <div className="flex justify-between">
                <span>Dust Cost:</span>
                <span className="font-medium">{deck.dust_cost}</span>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                deck.tier === 'Tier 1' ? 'bg-green-100 text-green-800' :
                deck.tier === 'Tier 2' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {deck.tier}
              </span>
              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Copy Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

