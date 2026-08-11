"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useApi from "@/api/useApi";

const PostList = () => {
  const router = useRouter();
  const api = useApi();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      await api.post("/posts", {
        title,
        content,
      });

      router.push("/list");
    } catch (error) {
      console.error("게시글 작성 실패", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-1040 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            게시글 작성
          </h1>

          <div className="flex shrink-0 gap-2 sm:gap-3.5">
            <button
              type="button"
              onClick={onCancel}
              className="h-9 rounded-md border border-[#d9dee7] bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 sm:h-10 sm:px-5 sm:text-base"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-9 rounded-md border border-blue-600 bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:h-10 sm:px-5 sm:text-base"
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
          className="mb-4 block h-14 w-full rounded-[7px] border border-[#d9dee7] bg-white px-3 text-sm text-gray-800 outline-none placeholder:text-[#b8bec8] focus:border-blue-600 sm:mb-5.75 sm:h-15.75 sm:px-3.75 sm:text-base"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="block min-h-75 w-full resize-y rounded-[7px] border border-[#d9dee7] bg-white px-3 py-3 text-sm leading-[1.6] text-gray-800 outline-none placeholder:text-[#b8bec8] focus:border-blue-600 sm:min-h-95 sm:px-3.75 sm:py-4 sm:text-base"
        />
      </div>
    </div>
  );
};

export default PostList;
