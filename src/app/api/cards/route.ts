import { NextResponse } from 'next/server';
import { createPublicClient } from '@/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const cardClass = searchParams.get('class') || '';
    const rarity = searchParams.get('rarity') || '';
    const type = searchParams.get('type') || '';
    const minCost = parseInt(searchParams.get('minCost') || '0');
    const maxCost = parseInt(searchParams.get('maxCost') || '10');

    const supabase = createPublicClient();

    // Build the query
    let query = supabase
      .from('hearthstone_cards')
      .select('*', { count: 'exact' })
      .eq('collectible', true)
      .order('cost', { ascending: true })
      .order('name_zh', { ascending: true });

    // Apply filters
    if (search) {
      query = query.or(`name_zh.ilike.%${search}%,text_zh.ilike.%${search}%`);
    }

    if (cardClass && cardClass !== 'all') {
      query = query.ilike('card_class', cardClass.toUpperCase());
    }

    if (rarity && rarity !== 'all') {
      query = query.ilike('rarity', rarity.toUpperCase());
    }

    if (type && type !== 'all') {
      query = query.ilike('type', type.toUpperCase());
    }

    if (minCost >= 0) {
      query = query.gte('cost', minCost);
    }

    if (maxCost <= 10) {
      query = query.lte('cost', maxCost);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    const { data: cards, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!cards) {
      return NextResponse.json({
        cards: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      });
    }

    // Helper function to build image URLs
    const buildImageUrls = (cardId: string) => {
      const baseUrl = 'https://art.hearthstonejson.com/v1';
      const renderBaseUrl = 'https://art.hearthstonejson.com/v1/render/latest/zhCN';

      return {
        orig: `${baseUrl}/orig/${cardId}.png`,
        normal: `${baseUrl}/256x/${cardId}.webp`,
        large: `${baseUrl}/512x/${cardId}.webp`,
        tile: `${baseUrl}/tiles/${cardId}.webp`,
        render: `${renderBaseUrl}/256x/${cardId}.png`,
        renderLarge: `${renderBaseUrl}/512x/${cardId}.png`
      };
    };

    // Transform cards data with image URLs and normalized fields
    const transformedCards = cards.map(card => ({
      ...card,
      imageUrls: buildImageUrls(card.id),
      rarity: card.rarity?.toLowerCase() || 'common',
      type: card.type?.toLowerCase() || 'minion',
      cardClass: card.card_class?.toLowerCase() || 'neutral',
      name_en: card.name_en || card.name_zh, // Fallback to Chinese name if English is missing
      text_en: card.text_en || card.text_zh // Fallback to Chinese text if English is missing
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      cards: transformedCards,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}