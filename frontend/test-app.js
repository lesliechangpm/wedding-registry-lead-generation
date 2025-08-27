// Quick test to verify the app is running properly
const http = require('http');

const testEndpoint = (url, description) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${description}: Status ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${description}: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
};

async function runTests() {
  console.log('🧪 Testing Wedding Registry Application...\n');
  
  const results = await Promise.all([
    testEndpoint('http://localhost:3000', 'Main Application'),
    testEndpoint('http://localhost:3000/login', 'Login Page'),
    testEndpoint('http://localhost:3000/dashboard', 'Dashboard Page'),
    testEndpoint('http://localhost:3000/leads', 'Lead Management Page'),
  ]);
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} endpoints accessible`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Application is running successfully.');
    console.log('🌐 Open http://localhost:3000 to view the application');
    console.log('🔐 Visit http://localhost:3000/login to see the beautiful login page');
  } else {
    console.log('⚠️  Some endpoints may not be accessible. Check the server logs.');
  }
}

runTests();