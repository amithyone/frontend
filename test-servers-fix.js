// Test script to verify the servers API fix
console.log('Testing servers API...');

// Simulate the fixed getServers method
async function testGetServers() {
  try {
    const baseUrl = 'https://api.fadsms.com/api';
    
    // Test without auth token (like the fixed version)
    const response = await fetch(`${baseUrl}/servers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header - this is the fix!
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch servers`);
    }

    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      console.log('✅ Servers API working correctly!');
      console.log('📊 Found', data.data.length, 'servers:');
      data.data.forEach((server, index) => {
        console.log(`  ${index + 1}. ${server.name} (${server.provider}) - ${server.success_rate}% success rate`);
      });
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch servers');
    }
  } catch (error) {
    console.error('❌ Error testing servers API:', error);
    return [];
  }
}

// Run the test
testGetServers().then(servers => {
  console.log('🎉 Test completed. Servers found:', servers.length);
});
