

import { createClient } from "@/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('page_size')) || 10;
    const sortBy = searchParams.get('sort_by') || 'release_date';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Filter for update content (contains version, patch_notes, affected_classes fields)
    const updateData = data?.filter(item => 
      item.deck_meta?.version && item.deck_meta?.patch_notes && item.deck_meta?.affected_classes !== undefined
    ) || [];

    return Response.json({
      data: updateData,
      pagination: {
        page,
        pageSize,
        total: updateData.length
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
        id: `update_${Date.now()}`,
        name: body.title || 'Game Update',
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

