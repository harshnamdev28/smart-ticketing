import { config } from '../src/config/env.js';

const API_URL = `http://localhost:${config.port}/api`;

async function createTestUser(email) {
  const res = await fetch(`${API_URL}/auth/mock-google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      name: 'Price Test User'
    })
  });
  const data = await res.json();
  return data.token;
}

async function createTestEvent(token, capacity, basePrice) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: `Price Test Event (Cap: ${capacity})`,
      description: `Testing surge pricing with capacity ${capacity} and base price ${basePrice}`,
      category: 'Test',
      venue: 'Test Venue',
      date: futureDate.toISOString(),
      basePrice,
      capacity,
      maxPerUser: capacity
    })
  });
  const data = await res.json();
  return data.id;
}

async function bookTicket(eventId, token) {
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
    success: res.status === 201,
    unitPrice: data.unitPrice,
    totalPrice: data.totalPrice
  };
}

async function getEvent(eventId) {
  const res = await fetch(`${API_URL}/events/${eventId}`);
  const data = await res.json();
  return data;
}

async function testPricing(capacity, basePrice) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Testing capacity: ${capacity}, base price: ${basePrice}`);
  console.log('═'.repeat(60));

  const token = await createTestUser(`pricetest${capacity}@example.com`);
  const eventId = await createTestEvent(token, capacity, basePrice);

  console.log(`\nEvent created: ${eventId}`);
  console.log(`Surge threshold: ${Math.ceil(capacity * 0.2)} tickets remaining (20% of ${capacity})\n`);

  const expectedSurgePrice = basePrice * 1.25;
  const surgeThreshold = Math.ceil(capacity * 0.2);

  console.log('Booking tickets one at a time...\n');

  for (let i = 1; i <= capacity; i++) {
    const event = await getEvent(eventId);
    const remaining = event.remaining;
    const currentPrice = event.currentPrice;
    const surgeActive = event.surgeActive;

    console.log(`Ticket ${i}/${capacity}: Remaining=${remaining}, Price=${currentPrice}, Surge=${surgeActive ? 'YES' : 'NO'}`);

    // Verify pricing logic
    if (remaining < surgeThreshold) {
      if (currentPrice !== expectedSurgePrice) {
        console.log(`   ❌ ERROR: Expected surge price ${expectedSurgePrice}, got ${currentPrice}`);
      }
      if (!surgeActive) {
        console.log(`   ❌ ERROR: Surge should be active when remaining < ${surgeThreshold}`);
      }
    } else {
      if (currentPrice !== basePrice) {
        console.log(`   ❌ ERROR: Expected base price ${basePrice}, got ${currentPrice}`);
      }
      if (surgeActive) {
        console.log(`   ❌ ERROR: Surge should NOT be active when remaining >= ${surgeThreshold}`);
      }
    }

    // Book the ticket
    const booking = await bookTicket(eventId, token);
    if (!booking.success) {
      console.log(`   ❌ Booking failed at ticket ${i}`);
      break;
    }

    // Verify the booking price matches current price
    if (booking.unitPrice !== currentPrice) {
      console.log(`   ❌ ERROR: Booked at price ${booking.unitPrice}, expected ${currentPrice}`);
    }
  }

  console.log('\n✅ Test completed for this capacity');
}

async function runPriceTests() {
  console.log('🧪 Starting Price Test...');
  
  // Test 1: Capacity 10, base price 100
  await testPricing(10, 100);
  
  // Test 2: Capacity 100, base price 100
  await testPricing(100, 100);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ All price tests completed');
  console.log('═'.repeat(60));
}

// Only run if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runPriceTests().catch(console.error);
}

export { runPriceTests };
