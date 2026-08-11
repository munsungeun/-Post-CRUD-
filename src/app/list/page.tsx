"use client";

import api from "@/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    role: string;
  };
};

const PostList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const getPost = async () => {
      const response = await api.get("/posts");
      setPosts(response.data);
    };

    getPost();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 w-full max-w-[1040px] items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="text-lg font-bold text-gray-900">게시판 관리</div>

          <div className="flex items-center gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="검색"
              className="h-8 w-[112px] rounded-full border border-gray-200 px-3 text-xs outline-none placeholder:text-gray-400 focus:border-blue-400 sm:h-9 sm:w-[160px] sm:px-4 sm:text-sm md:w-[208px]"
            />

            <button
              type="button"
              onClick={() => router.push("/")}
              className="whitespace-nowrap text-xs font-medium text-gray-500 hover:text-gray-800 sm:text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
          <div className="text-3xl font-bold text-gray-900 sm:text-4xl">
            게시글 목록
          </div>

          <button
            type="button"
            className="shrink-0 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 sm:px-5 sm:py-2.5 sm:text-sm"
            onClick={() => router.push("/post")}
          >
            새 게시글 작성
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[2fr_1.2fr_1fr_100px] items-center bg-gray-50 px-5 py-4 text-sm font-medium text-gray-500">
              <div>제목</div>
              <div>작성자</div>
              <div>작성일</div>
              <div className="text-center">관리</div>
            </div>

            <div>
              {posts.map((post) => (
                <div key={post.id}>
                  <div>{post.title}</div>

                  <div>{post.author.username}</div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setEditingId(post.id)}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      수정
                    </button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="border-t border-gray-100 py-12 text-center text-sm text-gray-400">
                  게시글이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostList;
