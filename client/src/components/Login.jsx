import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import "../toastStyles.css";

const Login = () => {
  const { login, showLoginPopup, setShowLoginPopup, axios } = useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoginPopup]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      setShowLoginPopup(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowLoginPopup(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        toast(<CustomToast message={data.message || (state === 'login' ? "Logged in" : "Account created")} />, {
          className: "minimal-toast",
          closeButton: false,
          autoClose: 1500,
          hideProgressBar: true,
        });

        login();
        setShowLoginPopup(false);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!showLoginPopup) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative animate-fadeIn">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 m-auto items-start">
          <button
            type="button"
            onClick={() => setShowLoginPopup(false)}
            className="absolute top-4 right-4 text-xl text-gray-400 hover:text-black"
          >
            ×
          </button>

          <p className="text-2xl font-medium m-auto">
            <span className="text-green-500">User</span> {state === "login" ? "Login" : "Sign Up"}
          </p>

          {state === "register" && (
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Type your name"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Type your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Type your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
              type="password"
              required
            />
          </div>

          <p className="text-sm">
            {state === "register" ? (
              <>
                Already have an account?{' '}
                <span onClick={() => setState("login")} className="text-green-600 cursor-pointer">
                  Login
                </span>
              </>
            ) : (
              <>
                New here?{' '}
                <span onClick={() => setState("register")} className="text-green-600 cursor-pointer">
                  Create account
                </span>
              </>
            )}
          </p>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition-all text-white w-full py-2 rounded-md"
          >
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
