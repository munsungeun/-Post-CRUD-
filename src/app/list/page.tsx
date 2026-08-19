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
  const [retouch, setRetouch] = useState<number | null>(null);
  const [admin, setAdmin] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [username, setUsername] = useState("");

  useEffect(() => {
    const adminCheck = localStorage.getItem("admin");
    const usernameCheck = localStorage.getItem("username");

    if (adminCheck === "true") {
      setAdmin(true);
    }

    if (usernameCheck) {
      setUsername(usernameCheck);
    }
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("게시글을 가져오는데 실패했습니다.", error);
      }
    };

    getPost();
  }, []);

  const Delete = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시글 삭제에 실패했습니다.", error);
    }
  };

  const Edit = async (id: number) => {
    try {
      await api.put(`/posts/${id}`, {
        title: title,
        content: content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                title: title,
                content: content,
              }
            : post,
        ),
      );

      setRetouch(null);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("게시글 수정에 실패했습니다.", error);
    }
  };

  const startEdit = (post: Post) => {
    setRetouch(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-5">
          <div className="text-lg font-bold tracking-tight">게시판 관리</div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="게시글 검색"
              className="h-9 w-[180px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
            />

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("admin");
                localStorage.removeItem("username");
                localStorage.removeItem("api");
                router.push("/");
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-5 py-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight">게시글 목록</div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/post")}
            className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            + 새 게시글
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_140px] items-center border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-xs font-semibold text-gray-500">
            <div>제목</div>
            <div>작성자</div>
            <div>작성일</div>
            <div className="text-center">관리</div>
          </div>

          <div>
            {posts.map((post) => {
              const canEdit = admin || post.author.username === username;

              return (
                <div
                  key={post.id}
                  className="border-b border-gray-100 px-5 py-4 last:border-b-0 hover:bg-gray-50/70"
                >
                  {retouch === post.id ? (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-3 text-xs font-semibold text-gray-500">
                        게시글 수정
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="제목"
                          className="w-[30%] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        />

                        <input
                          type="text"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="내용"
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        />

                        <button
                          type="button"
                          onClick={() => Edit(post.id)}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                        >
                          완료
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRetouch(null);
                            setTitle("");
                            setContent("");
                          }}
                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[2fr_1.2fr_1fr_140px] items-center">
                      <div className="truncate pr-4 text-sm font-medium text-gray-800">
                        {post.title}
                      </div>

                      <div className="text-sm text-gray-500">
                        {post.author.username}
                      </div>

                      <div className="pl-3.5 text-sm text-gray-400">-</div>

                      <div className="flex justify-center gap-2">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => startEdit(post)}
                            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            수정
                          </button>
                        )}

                        {admin && (
                          <button
                            type="button"
                            onClick={() => Delete(post.id)}
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {posts.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="text-sm font-medium text-gray-500">
                  게시글이 없습니다.
                </div>

                <div className="mt-1 text-xs text-gray-400">
                  새 게시글을 작성해보세요.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostList;
