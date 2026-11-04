import { config } from '../src/config/env.js';

const API_URL = `http://localhost:${config.port}/api`;

async function createTestUser(index) {
  const res = await fetch(`${API_URL}/auth/mock-google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `testuser${index}@example.com`,
      name: `Test User ${index}`
    })
  });
  const data = await res.json();
  return data.token;
}

async function createTestEvent(token) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Concurrency Test Event',
      description: 'Testing concurrent bookings with capacity 1',
      category: 'Test',
      venue: 'Test Venue',
      date: futureDate.toISOString(),
      basePrice: 100,
      capacity: 1,
      maxPerUser: 1
    })
  });
  const data = await res.json();
  return data.id;
}

async function bookTicket(eventId, token, userId) {
  try {
    const res = await fetch(`${API_URL}/events/${eventId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: 1 })
    });
    
    const data = await res.json();
    
    return {
      userId,
      success: res.status === 201,
      status: res.status,
      message: data.error || 'Success'
    };
  } catch (error) {
    return {
      userId,
      success: false,
      status: 'error',
      message: error.message
    };
  }
}

async function runConcurrencyTest() {
  console.log('🧪 Starting Concurrency Test...\n');
  console.log('Creating 10 users...');
  
  // Create 10 users
  const tokens = [];
  for (let i = 1; i <= 10; i++) {
    const token = await createTestUser(i);
    tokens.push({ userId: i, token });
  }
  console.log('✅ 10 users created\n');

  // Create event with capacity 1 using first user
  console.log('Creating event with capacity 1...');
  const eventId = await createTestEvent(tokens[0].token);
  console.log(`✅ Event created: ${eventId}\n`);

  // Fire 10 concurrent booking requests
  console.log('🚀 Firing 10 concurrent booking requests...\n');
  const bookingPromises = tokens.map(({ userId, token }) => 
    bookTicket(eventId, token, userId)
  );

  const results = await Promise.all(bookingPromises);

  // Analyze results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log('📊 RESULTS:');
  console.log('═══════════════════════════════════════\n');
  
  console.log(`✅ Successful bookings: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   - User ${r.userId}: ${r.message}`);
  });
  
  console.log(`\n❌ Failed bookings: ${failed.length}`);
  failed.forEach(r => {
    console.log(`   - User ${r.userId}: ${r.message} (${r.status})`);
  });

  console.log('\n═══════════════════════════════════════');
  
  if (successful.length === 1 && failed.length === 9) {
    const soldOutErrors = failed.filter(r => r.message.includes('sold out') || r.status === 409);
    if (soldOutErrors.length === 9) {
      console.log('✅ TEST PASSED: Exactly 1 booking succeeded, 9 got SOLD_OUT (409)');
    } else {
      console.log('⚠️  TEST WARNING: 1 succeeded but not all failures were SOLD_OUT');
    }
  } else {
    console.log('❌ TEST FAILED: Expected exactly 1 success and 9 failures');
  }
}

// Only run if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runConcurrencyTest().catch(console.error);
}

export { runConcurrencyTest };
