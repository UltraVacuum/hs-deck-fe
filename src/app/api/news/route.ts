

import { createClient } from "@/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('page_size')) || 10;
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sort_by') || 'published_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    const supabase = createClient();
    
    let query = supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });

    // We'll filter client-side since the data is stored in deck_meta JSONB

    const { data, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Filter for news content (contains author, content, category fields)
    const newsData = data?.filter(item => 
      item.deck_meta?.author && item.deck_meta?.content && item.deck_meta?.category
    ) || [];

    return Response.json({
      data: newsData,
      pagination: {
        page,
        pageSize,
        total: newsData.length
      }
    });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('cards')
      .insert([{ 
        id: `news_${Date.now()}`,
        name: body.title || 'News Article',
        cardMeta: body 
      }])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

