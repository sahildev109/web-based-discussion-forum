import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const generateSummary = async (post) => {
  
    console.log(post.answers);
    const answerTexts = post.answers.map((ans, index) => `Answer ${index + 1}: ${ans.answer}`).join('\n\n');
    console.log(answerTexts);
  
    const prompt = `
  Here are multiple answers from a forum thread:
  
  ${answerTexts}
  
  Summarize the key points and common insights discussed above in a concise bullet-point format.
  `;
  
    try {
        
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // you can move this to env later
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "user", content: prompt }]
        })
      });
  
      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content;
  
      console.log("Post Summary:\n", summary);
  
      // Optional: Save this summary in Firestore under the post doc
      const postDocRef = doc(firestore, "posts", post.id);
      await updateDoc(postDocRef, {
        summary: summary
      });
  
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };
  
  export default generateSummary;