const checkProfanity = async (text) => {
  try {
    const response = await fetch('https://web-based-discussion-forum.onrender.com/api/checkProfanity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.hasProfanity;
  } catch (error) {
    console.error("Error checking profanity:", error);
    return false;
  }
};
export default checkProfanity;