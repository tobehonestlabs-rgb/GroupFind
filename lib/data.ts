export type Group = {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  images: string[];
  ville: string;
  lien_invitation: string;
  membres_approximatifs: number;
  est_actif: boolean;
  note_moyenne: number;
  nombre_avis: number;
};

export const categories = [
  'Science et Teck',
  'Sport',
  'Musique',
  'Business',
  'Éducation',
  'Divertissement',
  'Gaming',
];

export const groups: Group[] = [
  {
    id: 'tech-abuja-1',
    categorie: 'Tech',
    nom: 'Dev CI - WhatsApp',
    description: 'Un groupe pour développeurs, designers et startups ivoiriens qui veulent partager des opportunités et des ressources.',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'Abidjan',
    lien_invitation: 'https://chat.whatsapp.com/example-tech',
    membres_approximatifs: 850,
    est_actif: true,
    note_moyenne: 4.8,
    nombre_avis: 58,
  },
  {
    id: 'business-abi-2',
    categorie: 'Business',
    nom: 'Entrepreneurs CI',
    description: 'Communauté de porteurs de projets et freelances pour échanger sur le business local, les collaborations et les événements.',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'Abidjan',
    lien_invitation: 'https://chat.whatsapp.com/example-business',
    membres_approximatifs: 420,
    est_actif: true,
    note_moyenne: 4.7,
    nombre_avis: 34,
  },
  {
    id: 'education-yop-3',
    categorie: 'Education',
    nom: 'Réussite Bac & Université',
    description: 'Aide aux étudiants, partage de ressources, cours et conseils pour réussir les examens en Côte d’Ivoire.',
    images: [
      'https://images.unsplash.com/photo-1495427513698-7a651fdbff48?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'Yopougon',
    lien_invitation: 'https://chat.whatsapp.com/example-education',
    membres_approximatifs: 1200,
    est_actif: true,
    note_moyenne: 4.9,
    nombre_avis: 82,
  },
  {
    id: 'lifestyle-daloa-4',
    categorie: 'Lifestyle',
    nom: 'Mode & Bien-être CI',
    description: 'Lifestyle, beauté, nutrition et tendances pour les jeunes ivoiriens qui veulent inspirer et se faire inspirer.',
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'Daloa',
    lien_invitation: 'https://chat.whatsapp.com/example-lifestyle',
    membres_approximatifs: 310,
    est_actif: true,
    note_moyenne: 4.5,
    nombre_avis: 19,
  },
  {
    id: 'sport-bouake-5',
    categorie: 'Sport',
    nom: 'Fans Football CI',
    description: 'Groupe de supporters et amateurs de foot pour suivre les matches, organiser des rencontres et partager l’actualité sportive.',
    images: [
      'https://images.unsplash.com/photo-1508264165352-258a6b5dfb94?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'Bouaké',
    lien_invitation: 'https://chat.whatsapp.com/example-sport',
    membres_approximatifs: 620,
    est_actif: true,
    note_moyenne: 4.6,
    nombre_avis: 46,
  },
  {
    id: 'voyage-san-pedro-6',
    categorie: 'Voyage',
    nom: 'Aventures Côte d’Ivoire',
    description: 'Partage de destinations, de bons plans et d’escapades dans tout le pays pour les voyageurs et les explorateurs.',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    ],
    ville: 'San Pedro',
    lien_invitation: 'https://chat.whatsapp.com/example-voyage',
    membres_approximatifs: 210,
    est_actif: true,
    note_moyenne: 4.4,
    nombre_avis: 12,
  },
];

export function getGroupById(id: string): Group | undefined {
  return groups.find((group) => group.id === id);
}

export function getGroupMedia(group: any) {
  const images = Array.isArray(group?.images) ? group.images : [];
  const banner = group?.banniere || group?.banner || group?.banner_url || images[0] || images[1] || '';
  const icon = group?.icone || group?.icon || group?.icon_url || images[1] || images[0] || '';
  return { banner, icon };
}

export function filterGroups(query?: string, category?: string) {
  const normalizedQuery = query?.trim().toLowerCase();
  return groups.filter((group) => {
    const matchesCategory = !category || category === 'Tous' || group.categorie === category;
    const matchesQuery =
      !normalizedQuery ||
      group.nom.toLowerCase().includes(normalizedQuery) ||
      group.description.toLowerCase().includes(normalizedQuery) ||
      group.ville.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
