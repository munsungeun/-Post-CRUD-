"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useApi from "@/api/useApi";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const api = useApi();

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <div className="mx-auto w-full max-w-[1040px] px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <h1 className="text-2xl font-bold text-[#1f2937] sm:text-3xl">
            게시글 작성
          </h1>

          <div className="flex shrink-0 gap-2 sm:gap-3.5">
            <button
              type="button"
              className="h-9 rounded-md border border-[#d9dee7] bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 sm:h-10 sm:px-5 sm:text-base"
              onClick={() => router.push("/list")}
            >
              취소
            </button>

            <button
              type="button"
              className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:h-10 sm:px-5 sm:text-base"
              onClick={async () => {
                await api.post("/posts", {
                  title: title,
                  content: content,
                });
              }}
            >
              저장
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="mb-5 block h-14 w-full rounded-[7px] border border-[#d9dee7] bg-white px-4 text-base text-gray-800 outline-none placeholder:text-[#b8bec8] focus:border-blue-600 sm:mb-6 sm:h-16 sm:px-4"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="block min-h-[360px] w-full resize-y rounded-[7px] border border-[#d9dee7] bg-white px-4 py-4 text-base leading-[1.6] text-gray-800 outline-none placeholder:text-[#b8bec8] focus:border-blue-600 sm:min-h-[400px] md:min-h-[460px]"
        />
      </div>
    </main>
  );
};

export default PostCreate;
