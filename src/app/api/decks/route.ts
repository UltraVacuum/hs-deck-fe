
import { createClient } from "@/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('page_size')) || 12;
    const deckClass = searchParams.get('class');
    const tier = searchParams.get('tier');
    const sortBy = searchParams.get('sort_by') || 'created_at';
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

    // Filter for deck content (contains cards, deck_class, archetype fields)
    const deckData = data?.filter(item => 
      item.deck_meta?.cards && item.deck_meta?.deck_class && item.deck_meta?.archetype
    ) || [];

    return Response.json({
      data: deckData,
      pagination: {
        page,
        pageSize,
        total: deckData.length
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
      .from('decks')
      .insert([{ deck_meta: body }])
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
