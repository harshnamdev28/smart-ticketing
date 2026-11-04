import { supabase } from '../src/config/supabase.js';

const demoUsers = [
  {
    email: 'alice@campus.edu',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    email: 'bob@campus.edu',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const demoEvents = [
  {
    title: 'Tech Talk: AI & Machine Learning',
    description: 'Join us for an insightful session on the latest trends in AI and machine learning. Industry experts will share their knowledge and answer your questions.',
    category: 'Tech',
    venue: 'Engineering Building, Room 101',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    base_price: 0,
    capacity: 150,
    max_per_user: 2,
    days_offset: 5
  },
  {
    title: 'Campus Music Festival 2026',
    description: 'The biggest music event of the year featuring local bands and special guest performances. Food trucks and activities included!',
    category: 'Music',
    venue: 'Central Quad',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    base_price: 25,
    capacity: 500,
    max_per_user: 4,
    days_offset: 14
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Watch student entrepreneurs pitch their innovative ideas to a panel of investors. Network with founders and VCs.',
    category: 'Business',
    venue: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    base_price: 10,
    capacity: 80,
    max_per_user: 1,
    days_offset: 7
  },
  {
    title: 'Photography Workshop: Night Shots',
    description: 'Learn professional techniques for stunning night photography. Bring your camera and join us for a hands-on session.',
    category: 'Workshop',
    venue: 'Arts Center Studio 3',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    base_price: 15,
    capacity: 25,
    max_per_user: 1,
    days_offset: 10
  },
  {
    title: 'Annual Hackathon 2026',
    description: '24-hour coding marathon! Build, innovate, and compete for amazing prizes. Free food and swag for all participants.',
    category: 'Tech',
    venue: 'Computer Science Building',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    base_price: 5,
    capacity: 200,
    max_per_user: 1,
    days_offset: 21
  },
  {
    title: 'Career Fair: Tech Companies',
    description: 'Meet recruiters from top tech companies. Bring your resume and be ready to make connections that could launch your career.',
    category: 'Career',
    venue: 'Student Union Hall',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    base_price: 0,
    capacity: 300,
    max_per_user: 1,
    days_offset: 12
  },
  {
    title: 'Comedy Night with Local Talent',
    description: 'Laugh the night away with stand-up performances from campus comedians and special guests. 18+ event.',
    category: 'Entertainment',
    venue: 'Campus Theater',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
    base_price: 12,
    capacity: 120,
    max_per_user: 3,
    days_offset: 6
  },
  {
    title: 'Exclusive: VR Gaming Experience',
    description: 'Try the latest VR games and immersive experiences. Limited slots available. First come, first served!',
    category: 'Gaming',
    venue: 'Game Lab, Library Basement',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800',
    base_price: 20,
    capacity: 30,
    max_per_user: 1,
    days_offset: 3
  }
];

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Insert demo users
    console.log('Creating demo users...');
    const userPromises = demoUsers.map(user =>
      supabase.from('users').upsert(user, { onConflict: 'email' }).select().single()
    );
    const userResults = await Promise.all(userPromises);
    const users = userResults.map(r => r.data);
    console.log(`✅ ${users.length} users created\n`);

    // Insert demo events (alternating between users as organizers)
    console.log('Creating demo events...');
    const eventPromises = demoEvents.map((event, index) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + event.days_offset);

      return supabase.from('events').insert({
        organizer_id: users[index % users.length].id,
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        image: event.image,
        date: futureDate.toISOString(),
        base_price: event.base_price,
        capacity: event.capacity,
        max_per_user: event.max_per_user,
        tickets_sold: 0
      }).select().single();
    });

    const eventResults = await Promise.all(eventPromises);
    const events = eventResults.map(r => r.data);
    console.log(`✅ ${events.length} events created\n`);

    console.log('═══════════════════════════════════════');
    console.log('✅ Seeding completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('\nDemo Users:');
    users.forEach(u => console.log(`  - ${u.name} (${u.email})`));
    console.log('\nDemo Events:');
    events.forEach(e => console.log(`  - ${e.title} (${e.capacity} capacity, $${e.base_price})`));
    console.log();

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Only run if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seed().catch(console.error);
}

export { seed };
