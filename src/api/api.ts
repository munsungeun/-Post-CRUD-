import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// api.interceptors: 우리가 만든 api라는 AxiosInstance를 이용할 때 실행할 기능을 정의하는 곳
// 그 중에, .request로 브라우저 -> 서버로 요청하는 것만 감지
api.interceptors.request.use((config) => {
  // Next.js는 서버/클라이언트 모두 호출 가능하기 때문에 클라이언트에서만 호출하도록 감지하는 코드임
  if (typeof window === "undefined") return config;

  // 누가봐도 당연히 알겠지만 localStorage에서 저장한 토큰 가져옴
  const token = localStorage.getItem("api");
  if (!token) return config; // 토큰 없으면 그냥 기본 값 사용

  // 토큰 있으면 header에 토큰 추가
  config.headers.Authorization = `Bearer ${token}`;
  return config; // 수정한 내용 반환
});

export default api;
