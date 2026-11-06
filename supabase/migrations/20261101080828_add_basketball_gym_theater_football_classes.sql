/*
# Add Basketball, Gym, Theater, and Football Classes

## Overview
Adds four new stores and eight new classes covering Basketball, Gym/Fitness,
Theater/Drama, and Football categories across Athens areas (Kallithea, Marousi,
Glyfada, Pagkrati).

## New Stores (4)
1. Athens Hoops Academy — Basketball, Pagkrati
2. IronCore Fitness — Gym, Kallithea
3. StageLight Theater School — Theater, Marousi
4. Athens Football Club — Football, Glyfada

## New Classes (8)
- 2 per store, covering kids and/or adult age ranges.

## Security
No RLS changes — existing public SELECT policies on stores and classes
apply to the new rows.
*/

INSERT INTO stores (id, name, description, category, area, address, phone, email, image_url) VALUES
(
  'a1a1a1a1-0009-4000-8000-000000000009',
  'Athens Hoops Academy',
  'A dedicated basketball academy for kids and teens. Our FIBA-certified coaches focus on fundamentals, teamwork, and game IQ in a fun, supportive environment.',
  'Basketball',
  'Pagkrati',
  '12 Arctinou St, Pagkrati 11636',
  '+30 210 701 2233',
  'info@athenshoops.gr',
  'https://images.pexels.com/photos/7201553/pexels-photo-7201553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0010-4000-8000-000000000010',
  'IronCore Fitness',
  'A modern gym and strength training facility. Personalized programs, certified trainers, and state-of-the-art equipment for every fitness level.',
  'Gym',
  'Kallithea',
  '34 Lampsa St, Kallithea 17673',
  '+30 210 942 5566',
  'info@ironcorefitness.gr',
  'https://images.pexels.com/photos/3888405/pexels-photo-3888405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0011-4000-8000-000000000011',
  'StageLight Theater School',
  'A creative theater school offering acting, improv, and stagecraft for all ages. Build confidence, voice, and presence on and off the stage.',
  'Theater',
  'Marousi',
  '56 Kifissias Ave, Marousi 15127',
  '+30 210 619 8844',
  'info@stagelight.gr',
  'https://images.pexels.com/photos/6896324/pexels-photo-6896324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0012-4000-8000-000000000012',
  'Athens Football Club',
  'Youth and adult football training on our full-size grass pitch. UEFA-licensed coaches, structured drills, and regular friendly matches.',
  'Football',
  'Glyfada',
  '8 Athinas Ave, Glyfada 16672',
  '+30 210 964 1199',
  'info@athensfc.gr',
  'https://images.pexels.com/photos/7307392/pexels-photo-7307392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (store_id, title, description, category, instructor, age_min, age_max, price_eur, duration_minutes, capacity, weekly_schedule, image_url) VALUES
-- Athens Hoops Academy (Basketball)
(
  'a1a1a1a1-0009-4000-8000-000000000009',
  'Kids Basketball Fundamentals',
  'Learn dribbling, shooting, and passing through fun drills and mini-games. Perfect for children taking their first steps on the court.',
  'Basketball',
  'Coach Takis Antoniou',
  6, 12,
  22.00, 75, 16,
  'Mon & Wed 17:00',
  'https://images.pexels.com/photos/7207364/pexels-photo-7207364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0009-4000-8000-000000000009',
  'Teen Basketball Training',
  'Advanced skills development for teens — pick-and-roll, defensive positioning, and game strategy. Competitive and recreational groups available.',
  'Basketball',
  'Coach Takis Antoniou',
  13, 17,
  28.00, 90, 12,
  'Tue & Thu 18:00',
  'https://images.pexels.com/photos/7201553/pexels-photo-7201553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
-- IronCore Fitness (Gym)
(
  'a1a1a1a1-0010-4000-8000-000000000010',
  'Teen Strength & Conditioning',
  'A safe introduction to strength training for teenagers. Learn proper form, build functional strength, and develop healthy fitness habits for life.',
  'Gym',
  'Trainer Eleni Vassiliou',
  14, 17,
  30.00, 60, 10,
  'Mon, Wed, Fri 16:00',
  'https://images.pexels.com/photos/3888405/pexels-photo-3888405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0010-4000-8000-000000000010',
  'Adult Functional Fitness',
  'Full-body functional training circuits for all fitness levels. Build strength, mobility, and endurance with personalized coaching.',
  'Gym',
  'Trainer Eleni Vassiliou',
  18, null,
  25.00, 60, 12,
  'Tue, Thu 19:00, Sat 10:00',
  'https://images.pexels.com/photos/40371849/pexels-photo-40371849.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
-- StageLight Theater School (Theater)
(
  'a1a1a1a1-0011-4000-8000-000000000011',
  'Kids Drama & Improv',
  'A playful introduction to theater for children. Through games, storytelling, and improv, kids build confidence, creativity, and teamwork.',
  'Theater',
  'Dimitra Kosma',
  7, 12,
  24.00, 90, 14,
  'Sat 11:00',
  'https://images.pexels.com/photos/6896324/pexels-photo-6896324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0011-4000-8000-000000000011',
  'Teen & Adult Acting Workshop',
  'Explore character work, scene study, and audition technique. Suitable for beginners and experienced actors looking to sharpen their craft.',
  'Theater',
  'Dimitra Kosma',
  14, null,
  32.00, 120, 12,
  'Wed 19:00',
  'https://images.pexels.com/photos/6896323/pexels-photo-6896323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
-- Athens Football Club (Football)
(
  'a1a1a1a1-0012-4000-8000-000000000012',
  'Kids Football Training',
  'Dribbling, passing, shooting, and small-sided games. A fun, structured program that builds skills and a love for the game.',
  'Football',
  'Coach Giorgos Nikolaidis',
  6, 12,
  20.00, 75, 20,
  'Tue & Thu 17:00',
  'https://images.pexels.com/photos/26283685/pexels-photo-26283685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
),
(
  'a1a1a1a1-0012-4000-8000-000000000012',
  'Adult Football Training',
  'Technical drills, fitness, and match play for adults. All skill levels welcome — bring your boots and enjoy the game!',
  'Football',
  'Coach Giorgos Nikolaidis',
  18, null,
  25.00, 90, 22,
  'Mon & Wed 20:00',
  'https://images.pexels.com/photos/7307392/pexels-photo-7307392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
)
ON CONFLICT DO NOTHING;