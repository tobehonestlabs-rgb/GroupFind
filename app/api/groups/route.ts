import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '../../../lib/supabase';

const BUCKET_NAME = 'groups_images';

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
      };

      if (bannerFile instanceof File) {
        const bannerUrl = await uploadImageFile(supabase, bannerFile, 'banners');
        payload.images.push(bannerUrl);
      }

      if (iconFile instanceof File) {
        const iconUrl = await uploadImageFile(supabase, iconFile, 'icons');
        payload.images.push(iconUrl);
      }
    } else {
      payload = await request.json();
      payload.est_actif = payload.est_actif ?? true;
      payload.images = payload.images || [];
    }

    const tableName = process.env.NEXT_PUBLIC_SUPABASE_GROUPS || 'groupes';
    const { data, error } = await supabase.from(tableName).insert(payload).select();
    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
