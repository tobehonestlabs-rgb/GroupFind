import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '../../../lib/supabase';

const BUCKET_NAME = 'groups_images';
const TABLE_NAME = process.env.NEXT_PUBLIC_SUPABASE_GROUPS || 'groupes';

async function uploadImageFile(supabase: any, file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  const filename = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filename, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (error) throw error;

  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data?.path || filename);
  return publicData.publicUrl;
}

function buildImageArray(existingImages: string[] = [], bannerFile?: File | null, iconFile?: File | null) {
  const images = [...existingImages];
  if (bannerFile) {
    images[0] = 'pending';
  }
  if (iconFile) {
    images[1] = 'pending';
  }
  return images;
}

async function resolveImages(supabase: any, existingImages: string[] = [], bannerFile?: File | null, iconFile?: File | null) {
  const images = [...existingImages];
  if (bannerFile instanceof File) {
    const bannerUrl = await uploadImageFile(supabase, bannerFile, 'banners');
    images[0] = bannerUrl;
  }
  if (iconFile instanceof File) {
    const iconUrl = await uploadImageFile(supabase, iconFile, 'icons');
    images[1] = iconUrl;
  }
  return images.filter(Boolean);
}

async function ensureSingleCommunity(supabase: any, ownerId: string) {
  const { data, error } = await supabase.from(TABLE_NAME).select('id').eq('proprietaire', ownerId).limit(1);
  if (error) throw error;
  return data?.[0] || null;
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();
    const contentType = request.headers.get('content-type') || '';

    let payload: any = {
      est_actif: true,
      images: [],
    };

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const bannerFile = formData.get('banner');
      const iconFile = formData.get('icon');
      const ownerId = formData.get('proprietaire')?.toString() || formData.get('owner_id')?.toString() || '';

      payload = {
        categorie: formData.get('categorie')?.toString() || '',
        nom: formData.get('nom')?.toString() || '',
        description: formData.get('description')?.toString() || '',
        ville: formData.get('ville')?.toString() || '',
        lien_invitation: formData.get('lien_invitation')?.toString() || '',
        membres_approximatifs: Number(formData.get('membres_approximatifs') || 0),
        cree_par: formData.get('cree_par')?.toString() || null,
        contact_createur: formData.get('contact_createur')?.toString() || '',
        est_actif: true,
        images: [],
        proprietaire: ownerId || null,
        owner_id: ownerId || null,
      };

      if (ownerId) {
        const existing = await ensureSingleCommunity(supabase, ownerId);
        if (existing) {
          return NextResponse.json({ ok: false, error: 'Vous avez déjà une communauté' }, { status: 409 });
        }
      }

      payload.images = await resolveImages(supabase, [], bannerFile instanceof File ? bannerFile : null, iconFile instanceof File ? iconFile : null);
    } else {
      payload = await request.json();
      payload.est_actif = payload.est_actif ?? true;
      payload.images = payload.images || [];
      if (payload.proprietaire || payload.owner_id) {
        const ownerId = payload.proprietaire || payload.owner_id;
        const existing = await ensureSingleCommunity(supabase, ownerId);
        if (existing) {
          return NextResponse.json({ ok: false, error: 'Vous avez déjà une communauté' }, { status: 409 });
        }
      }
    }

    const { data, error } = await supabase.from(TABLE_NAME).insert(payload).select();
    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerSupabase();
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const id = formData.get('id')?.toString();
      const bannerFile = formData.get('banner');
      const iconFile = formData.get('icon');
      const existingImages = formData.get('existingImages')?.toString() ? JSON.parse(formData.get('existingImages')?.toString() || '[]') : [];
      const payload: any = {
        categorie: formData.get('categorie')?.toString() || '',
        nom: formData.get('nom')?.toString() || '',
        description: formData.get('description')?.toString() || '',
        ville: formData.get('ville')?.toString() || '',
        lien_invitation: formData.get('lien_invitation')?.toString() || '',
      };

      payload.images = await resolveImages(supabase, existingImages, bannerFile instanceof File ? bannerFile : null, iconFile instanceof File ? iconFile : null);
	
      const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq('id', id).select();
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    const body = await request.json();
    const { id, ...payload } = body;
    const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq('id', id).select();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Identifiant requis' }, { status: 400 });
    }
    const { data, error } = await supabase.from(TABLE_NAME).delete().eq('id', id).select();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
