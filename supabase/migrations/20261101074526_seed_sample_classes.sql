/*
# Seed Sample Data — Stores & Classes

Populates the platform with realistic stores and classes spread across
three Athens areas (Kallithea, Marousi, Glyfada). Covers a range of
activity categories: martial arts, music, dance, art, yoga, languages,
and swim schools.

## Notes
1. Eight stores total — each with description, contact info, and image URL.
2. Each store has 1–3 classes with age ranges, pricing, schedules, and instructors.
3. No RLS changes — all data is intentionally public; existing SELECT policies apply.
*/

-- ════════════════════════════════════════════════════════════
-- STORES
-- ════════════════════════════════════════════════════════════

INSERT INTO stores (id, name, description, category, area, address, phone, email, image_url) VALUES
(
  'a1a1a1a1-0001-4000-8000-000000000001',
  'Athens Karate Dojo',
  'A traditional Shotokan karate dojo serving central Athens since 2009. We welcome students of all ages and skill levels, from first-time beginners to advanced practitioners.',
  'Martial Arts',
  'Kallithea',
  '28 Apostolou Pavlou St, Kallithea 17672',
  '+30 210 941 2233',
  'info@athenskarate.gr',
  'https://images.unsplash.com/photo-1559564614-7a4b8a4d0c8e?w=1200&q=80'
),
(
  'a1a1a1a1-0002-4000-8000-000000000002',
  'Melodia Music Academy',
  'Professional music school offering individual and group lessons in piano, guitar, violin, and voice. Our experienced instructors help every student discover their musical voice.',
  'Music',
  'Marousi',
  '15 Kifissias Ave, Marousi 15124',
  '+30 210 618 4455',
  'hello@melodiamusic.gr',
  'https://images.unsplash.com/photo-1558364225-9017a4e4e0c8?w=1200&q=80'
),
(
  'a1a1a1a1-0003-4000-8000-000000000003',
  'Artemis Dance Studio',
  'A vibrant dance studio offering ballet, contemporary, and hip-hop classes for children and adults. Our spacious studios are designed for movement and creativity.',
  'Dance',
  'Glyfada',
  '42 Poseidonos Ave, Glyfada 16675',
  '+30 210 890 3344',
  'info@artemisdance.gr',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80'
),
(
  'a1a1a1a1-0004-4000-8000-000000000004',
  'Kallithea Art Workshop',
  'A creative space where children and adults explore painting, pottery, and sculpture. Small class sizes mean personalized guidance from our professional artists.',
  'Art',
  'Kallithea',
  '7 Sintagma Sq, Kallithea 17676',
  '+30 210 951 7788',
  'info@kallitheaart.gr',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80'
),
(
  'a1a1a1a1-0005-4000-8000-000000000005',
  'ZenFlow Yoga Studio',
  'Find your balance with our variety of yoga classes — Hatha, Vinyasa, Yin, and prenatal. Our certified teachers create a calm, welcoming space for everyone.',
  'Yoga',
  'Marousi',
  '88 Kifissias Ave, Marousi 15125',
  '+30 210 670 1199',
  'info@zenflowyoga.gr',
  'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&q=80'
),
(
  'a1a1a1a1-0006-4000-8000-000000000006',
  'Glyfada Swim Club',
  'Year-round indoor swimming lessons for all ages and abilities. Our Olympic-size pool and certified coaches make learning to swim safe and fun.',
  'Swimming',
  'Glyfada',
  '5 Beach Ave, Glyfada 16674',
  '+30 210 967 5566',
  'info@glyfadaswim.gr',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80'
),
(
  'a1a1a1a1-0007-4000-8000-000000000007',
  'Marousi Language Center',
  'Modern language learning for children and adults. Small-group English, French, German, and Spanish courses with native-speaking teachers.',
  'Languages',
  'Marousi',
  '23 Ermou St, Marousi 15123',
  '+30 210 683 2244',
  'info@marousilanguages.gr',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=80'
),
(
  'a1a1a1a1-0008-4000-8000-000000000008',
  'Glyfada Tennis Academy',
  'From first lesson to competitive play, our USPTA-certified coaches run programs for children, teens, and adults on our six clay courts.',
  'Tennis',
  'Glyfada',
  '18 Anastasiou St, Glyfada 16677',
  '+30 210 998 4477',
  'info@glyfadatennis.gr',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=800'
)
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- CLASSES
-- ════════════════════════════════════════════════════════════

INSERT INTO classes (store_id, title, description, category, instructor, age_min, age_max, price_eur, duration_minutes, capacity, weekly_schedule, image_url) VALUES
-- Athens Karate Dojo
(
  'a1a1a1a1-0001-4000-8000-000000000001',
  'Kids Karate Beginners',
  'A fun, safe introduction to karate for young children. Builds discipline, coordination, and confidence through games and basic techniques.',
  'Martial Arts',
  'Sensei Nikos Papadopoulos',
  6, 12,
  25.00, 60, 15,
  'Tue & Thu 17:00',
  'https://images.unsplash.com/photo-1602072917553-3d3e4b5b1d8f?w=1200&q=80'
),
(
  'a1a1a1a1-0001-4000-8000-000000000001',
  'Teen & Adult Karate',
  'Traditional Shotokan training for teens and adults. Covers kihon, kata, and kumite. Suitable for all belt levels.',
  'Martial Arts',
  'Sensei Nikos Papadopoulos',
  13, null,
  30.00, 90, 20,
  'Mon & Wed 19:00',
  'https://images.unsplash.com/photo-1583266924-8f4b5b3e6e8c?w=1200&q=80'
),
-- Melodia Music Academy
(
  'a1a1a1a1-0002-4000-8000-000000000002',
  'Piano for Beginners',
  'Learn the fundamentals of piano in a supportive environment. Individual lessons cover technique, theory, and your first pieces.',
  'Music',
  'Maria Konstantinou',
  7, 99,
  35.00, 45, 1,
  'Flexible (book your slot)',
  'https://images.unsplash.com/photo-1520523839897-bd5b52c1d3a0?w=1200&q=80'
),
(
  'a1a1a1a1-0002-4000-8000-000000000002',
  'Guitar Group Class',
  'Group guitar lessons for kids and teens. Learn chords, rhythm, and your favourite songs in a fun, social setting.',
  'Music',
  'Dimitris Eleftheriou',
  10, 17,
  22.00, 60, 6,
  'Sat 11:00',
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=80'
),
-- Artemis Dance Studio
(
  'a1a1a1a1-0003-4000-8000-000000000003',
  'Children''s Ballet',
  'Classical ballet foundations for young dancers. Focus on posture, grace, and musicality in a joyful, encouraging atmosphere.',
  'Dance',
  'Elena Marinaki',
  5, 10,
  28.00, 60, 12,
  'Wed & Fri 16:00',
  'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&q=80'
),
(
  'a1a1a1a1-0003-4000-8000-000000000003',
  'Adult Hip-Hop',
  'High-energy hip-hop choreography for teens and adults. No experience needed — just bring your energy!',
  'Dance',
  'Andreas Vlachos',
  14, null,
  26.00, 75, 20,
  'Tue & Thu 20:00',
  'https://images.unsplash.com/photo-1547347298-4074fc308b56?w=1200&q=80'
),
-- Kallithea Art Workshop
(
  'a1a1a1a1-0004-4000-8000-000000000004',
  'Kids Art Exploration',
  'Painting, drawing, and crafts for children. Each session explores a new material or technique — from watercolours to clay.',
  'Art',
  'Sophia Iordanou',
  6, 12,
  24.00, 90, 10,
  'Sat 10:00',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5c38?w=1200&q=80'
),
(
  'a1a1a1a1-0004-4000-8000-000000000004',
  'Adult Pottery & Ceramics',
  'Hands-on pottery for adults. Learn hand-building and wheel-throwing in our fully equipped ceramics studio.',
  'Art',
  'Sophia Iordanou',
  18, null,
  38.00, 120, 8,
  'Mon 18:00',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80'
),
-- ZenFlow Yoga Studio
(
  'a1a1a1a1-0005-4000-8000-000000000005',
  'Vinyasa Flow Yoga',
  'A dynamic, flowing practice linking breath and movement. Builds strength, flexibility, and focus. All levels welcome.',
  'Yoga',
  'Katerina Roussou',
  16, null,
  20.00, 75, 18,
  'Mon, Wed, Fri 09:00 & 19:00',
  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80'
),
(
  'a1a1a1a1-0005-4000-8000-000000000005',
  'Family Yoga',
  'Yoga for parents and children to practice together. A bonding experience filled with games, poses, and relaxation.',
  'Yoga',
  'Katerina Roussou',
  5, 99,
  32.00, 60, 10,
  'Sat 11:00',
  'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=1200&q=80'
),
-- Glyfada Swim Club
(
  'a1a1a1a1-0006-4000-8000-000000000006',
  'Kids Swimming Lessons',
  'Structured swim instruction following the official Learn-to-Swim program. Small groups ensure plenty of individual attention.',
  'Swimming',
  'Coach Yiannis Manos',
  4, 12,
  30.00, 45, 8,
  'Tue, Thu 16:00 & 17:00',
  'https://images.unsplash.com/photo-1568404322957-1e4e6c0c8c87?w=1200&q=80'
),
(
  'a1a1a1a1-0006-4000-8000-000000000006',
  'Adult Aqua Fitness',
  'Low-impact water workouts that build cardio fitness and muscle tone. Great for all fitness levels and joint-friendly.',
  'Swimming',
  'Coach Yiannis Manos',
  18, null,
  28.00, 60, 15,
  'Mon, Wed, Fri 08:00',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80'
),
-- Marousi Language Center
(
  'a1a1a1a1-0007-4000-8000-000000000007',
  'English for Kids',
  'Interactive English lessons for young learners. Stories, songs, and games make language learning natural and fun.',
  'Languages',
  'Emma Wilkinson',
  7, 12,
  25.00, 90, 10,
  'Mon & Wed 17:00',
  'https://images.unsplash.com/photo-1503676262382-5328eb18a8b0?w=1200&q=80'
),
(
  'a1a1a1a1-0007-4000-8000-000000000007',
  'Conversational French',
  'Practical, spoken French for adults. Build confidence for travel, work, or pleasure through real-life conversations.',
  'Languages',
  'Camille Dubois',
  16, null,
  30.00, 90, 8,
  'Tue & Thu 18:30',
  'https://images.unsplash.com/photo-1546484959-f9a381d1330d?w=1200&q=80'
),
-- Glyfada Tennis Academy
(
  'a1a1a1a1-0008-4000-8000-000000000008',
  'Mini Tennis for Kids',
  'A playful introduction to tennis with smaller courts, lighter balls, and lots of games. Perfect for building coordination and love for the sport.',
  'Tennis',
  'Coach Elena Stavrou',
  5, 9,
  27.00, 60, 6,
  'Sat 09:00 & 10:00',
  'https://images.unsplash.com/photo-1599058917765-a780eda07a2e?w=1200&q=80'
),
(
  'a1a1a1a1-0008-4000-8000-000000000008',
  'Adult Tennis Clinic',
  'Drills, technique work, and match play for adult players. Intermediate level — some playing experience recommended.',
  'Tennis',
  'Coach Elena Stavrou',
  18, null,
  35.00, 90, 4,
  'Tue & Thu 19:00',
  'https://images.unsplash.com/photo-1554064905-5d8b2e8c7d3a?w=1200&q=80'
)
ON CONFLICT DO NOTHING;
