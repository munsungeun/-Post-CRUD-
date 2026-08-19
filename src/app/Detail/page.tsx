"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/api/api";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
}

const PostDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error("게시글 로딩 실패", error);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400">게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        {/* 상단 버튼 영역 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/list")}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            ← 목록으로
          </button>
        </div>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            {post.title}
          </h1>

          <hr className="my-6 border-gray-100" />

          <div className="min-h-[300px] text-base leading-relaxed text-gray-700 whitespace-pre-wrap sm:text-lg sm:leading-8">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
};

export default PostDetail;
