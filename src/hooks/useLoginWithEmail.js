import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { auth, firestore } from "../firebase/firebase";
import AuthStore from "../store/AuthStore";
import { doc, getDoc } from "firebase/firestore";


const useLoginwithEmail = () => {
	
	const [signInWithEmailAndPassword,user , loading, error] = useSignInWithEmailAndPassword(auth);
	const loginUser = AuthStore((state) => state.login);

	const login = async (inp) => {
		if (!inp.email || !inp.password) {
            alert("Please fill all the fields");
			return ;
		}
		try {
		const userCred=	await signInWithEmailAndPassword(inp.email, inp.password);
		if (userCred) { 
			const docRef = doc(firestore, "users", userCred.user.uid);
			const docSnap = await getDoc(docRef);
			localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
			loginUser(docSnap.data());
		}
			
		} catch (error) {
			console.log(error);
		}
	};

	return { loading, error, login };
};

export default useLoginwithEmail