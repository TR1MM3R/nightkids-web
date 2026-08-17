const fs = require('fs');
fs.writeFileSync('test.txt', 'Hello Nightkids!');

async function testUpload() {
  const { upload } = await import('@vercel/blob/client');
  const file = new Blob(['Hello Nightkids!'], { type: 'text/plain' });
  
  try {
    const result = await upload('test.txt', file, {
      access: 'public',
      handleUploadUrl: 'https://nightkids-web.vercel.app/api/upload',
    });
    console.log("Success:", result);
  } catch (e) {
    console.error("Error:", e);
  }
}

testUpload();
