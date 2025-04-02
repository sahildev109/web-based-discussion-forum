import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";


const useLogout = () => {
	const [signOut, isLoggingOut, error] = useSignOut(auth);
	


	const handleLogout = async () => {
		try {
			await signOut();
			
           
		} catch (error) {
			console.log(error);
		}
	};

	return { handleLogout, isLoggingOut, error };
};

export default useLogout;