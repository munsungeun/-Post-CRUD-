"use client";
interface LoginResponse {
  token: string;
}

import { useEffect, useState } from "react";
import PostList from "./list/page";
import { useRouter } from "next/navigation";
import api from "@/api/api";

const Login = () => {
  const [name, setName] = useState("");
  const [passWord, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mb-10 text-4xl font-bold text-black">
        {signUp ? "회원가입" : "로그인"}
      </div>

      <div className="w-125 rounded-lg border border-gray-200 bg-white p-10 text-left shadow-md">
        <div className="mb-2 block text-sm font-bold text-gray-700">
          사용자 이름
        </div>

        <input
          type="text"
          placeholder="사용자 이름을 입력하세요"
          className="mb-8 h-12 w-full rounded-md border border-gray-300 px-3 text-black placeholder:text-gray-400 focus:outline-none"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <div className="mb-2 block text-sm font-bold text-gray-700">
          비밀번호
        </div>

        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="mb-7 h-12 w-full rounded-md border text-black border-gray-300 px-3 placeholder:text-gray-400 focus:outline-none"
          value={passWord}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button
          className="h-12 w-full rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
          onClick={async () => {
            try {
              if (!signUp) {
                const { data } = await api.post("/sign-in", {
                  username: name,
                  password: passWord,
                });

                setToken(data.token);
                localStorage.setItem("api", data.token);
                router.replace("/list");
              } else {
                await api.post("/sign-up", {
                  username: name,
                  password: passWord,
                });
              }
            } catch (error) {
              alert(signUp ? "회원가입 실패" : "로그인 실패");
              console.error(error);
            }
          }}
        >
          {signUp ? "회원가입" : "로그인"}
        </button>
        <button
          className="text-gray-400 w-full p-3 text-center text-sm underline"
          onClick={() => {
            setSignUp(!signUp);
          }}
        >
          {!signUp ? "회원가입하기" : "로그인하기"}
        </button>
      </div>
    </div>
  );
};

export default Login;
