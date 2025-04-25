const checkProfanity = async (text) => {
  try {
    console.log("Checking profanity for text:", text); // Log the text being checked
    const response = await fetch('https://web-based-discussion-forum.onrender.com/api/checkProfanity', {
   // Log the request being sent
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    console.log("Sending request to profanity check API"); 
    const data = await response.json();
    console.log("Profanity check response:", data); // Log the response for debugging
    return data.hasProfanity;
  } catch (error) {
    console.error("Error checking profanity:", error);
    return false;
  }
};
export default checkProfanity;