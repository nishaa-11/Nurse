import axios from 'axios';

async function testRegistration() {
  try {
    console.log('Testing hospital registration...');
    
    const hospitalData = {
      name: "Test Hospital",
      email: "hospital@test.com", 
      password: "password123",
      role: "hospital",
      phone: "+1234567890",
      hospitalProfile: {
        hospitalType: "General",
        size: "Medium (101-300 beds)"
      },
      address: {
        street: "123 Main St",
        city: "New York", 
        state: "NY",
        zipCode: "10001"
      },
      location: {
        type: "Point",
        coordinates: [0, 0]
      }
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', hospitalData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Registration failed!');
    console.error('Error:', error.response?.data || error.message);
  }
}

testRegistration();