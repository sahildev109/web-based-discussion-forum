import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useSignUpWithEmail from "./hooks/useSignUpWithEmail";
import useLoginwithEmail from "./hooks/useLoginWithEmail";
import { AtSign } from "lucide-react";

const AuthenticationPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const { loading, error, signup } = useSignUpWithEmail();
  const { loading: loginLoading, error: loginError, login } = useLoginwithEmail();

  const [inp, setInp] = useState({
    name: "",
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleForm = async () => {
    if (isSignUp) {
      if (inp.password !== inp.confirmPassword) {
        setLocalError("Passwords do not match");
        return;
      }
    }

    setLocalError("");

    try {
      if (isSignUp) {
        await signup(inp);
      } else {
        await login(inp);
      }
      navigate("/forum");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: "url('/4281689.jpg')" }}>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-gray-500 text-center text-sm mt-2">
          {isSignUp ? "Sign up to get started" : "Login to continue"}
        </p>

        <form className="mt-6 space-y-4"
        >
          {(localError || error || loginError) && (
            <div className="text-red-500 text-sm text-center">
              {localError || error || loginError}
            </div>
          )}

          {isSignUp && (<>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
                value={inp.name}
                onChange={(e) => setInp({ ...inp, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
                value={inp.username}
                onChange={(e) => setInp({ ...inp, username: e.target.value })}
              />
            </div>
            </>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
              value={inp.email}
              onChange={(e) => setInp({ ...inp, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500"
              value={inp.password}
              onChange={(e) => setInp({ ...inp, password: e.target.value })}
            />
          </div>

          {isSignUp && (
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full pl-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-500 "
                value={inp.confirmPassword}
                onChange={(e) => setInp({ ...inp, confirmPassword: e.target.value })}
              />
            </div>
          )}

          <button
            className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer disabled:opacity-50 font-bold"
            onClick={handleForm}
            disabled={loading || loginLoading}
          >
            {(loading || loginLoading) ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-yellow-500  font-bold hover:underline cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthenticationPage;