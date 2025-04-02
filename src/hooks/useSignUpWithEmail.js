import { collection, getDocs, query, setDoc, where,doc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import AuthStore from "../store/AuthStore";

const useSignUpWithEmail = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

    const signupUser=AuthStore(state=>state.login);

  const signup = async (inp) => {
    event.preventDefault();
    if (!inp.email || !inp.password || !inp.name||!inp.username) {
     
      alert("Please fill all the fields");
      return;
    }



    try {
      console.log("🔥 Running Firestore Query");
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("username", "==", inp.username));
    
      const querySnapshot = await getDocs(q);
      console.log("✅ Query Executed. Documents Found:", querySnapshot.docs.length);
    
      if (!querySnapshot.empty) {
        alert("Username already exists");
        console.log("🚨 Username already exists");
        return;
      }
    
      console.log("✅ Username is unique. Proceeding with signup.");
    } catch (error) {
      console.error("🔥 Firestore Query Error:", error);
    }
    

    try {
      const newUser= await createUserWithEmailAndPassword(inp.email, inp.password);
      console.log(newUser)
      if (newUser) {
				const userDoc = {
					uid: newUser.user.uid,
					email: inp.email,
					username: inp.username,
					fullName: inp.name,
					
					profilePicURL: "",
					friends: [],
					
					posts: [],
					createdAt: Date.now()
				};
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user-info", JSON.stringify(userDoc));
        signupUser(userDoc);
      }


    } catch (error) {
      console.log(error);
    }
  };

  return { loading, error, signup };
};

export default useSignUpWithEmail;
