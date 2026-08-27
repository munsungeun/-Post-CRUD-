const express = require("express");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;
const SECRET_KEY = "temp";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JOBIS Internship Backend API",
      version: "1.0.0",
      description: "임시 백엔드 API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            author: {
              type: "object",
              properties: {
                id: { type: "integer" },
                username: { type: "string" },
                role: { type: "string" },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

const users = [
  { id: 1, username: "user", password: "password", role: "user" },
  { id: 2, username: "admin", password: "admin_password", role: "admin" },
];

let posts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
    authorId: 1,
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the content of the second post.",
    authorId: 2,
  },
];

users.forEach((user) => {
  user.password = bcrypt.hashSync(user.password, 10);
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" },
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(403).send("A token is required for authentication");

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send("Invalid Token");
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).send("You do not have the necessary permissions");
  }
  next();
};

/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: 사용자 민증검사
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 인증 정보
 */
app.post("/sign-in", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("왜 이상한거 씀?");
  }

  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = generateToken(user);
    req.session.user = user;
    return res.json({
      message: "Logged in successfully",
      token: token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  }
  res.status(400).send("Invalid credentials");
});

/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: 사용자 출생신고
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 출생신고 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 다 니잘못
 */
app.post("/sign-up", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("왜 이상한거 씀?");
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).send("Already User 있는데 왜 만들라 함 ㅋ");
  }
  users.push({
    id: Math.max(...users.map((u) => u.id)) + 1,
    role: "user",
    username,
    password: bcrypt.hashSync(password, 10),
  });
  res.status(200).send("너 짱");
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 모든 게시글 조회
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */
app.get("/posts", verifyToken, (req, res) => {
  const postsWithAuthor = posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: author
        ? {
            id: author.id,
            username: author.username,
            role: author.role,
          }
        : null,
    };
  });
  res.json(postsWithAuthor);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 새 게시글 생성
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */
app.post("/posts", verifyToken, checkRole(["user", "admin"]), (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    authorId: req.user.id,
  };

  posts.push(newPost);

  const author = users.find((user) => user.id === req.user.id);

  const responsePost = {
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    author: {
      id: author.id,
      username: author.username,
      role: author.role,
    },
  };

  res.status(201).json(responsePost);
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.put("/posts/:id", verifyToken, (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("Title and content are required");
  }
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  const post = posts[postIndex];

  if (req.user.role === "admin" || req.user.id === post.authorId) {
    if (title) post.title = title;
    if (content) post.content = content;

    const author = users.find((user) => user.id === post.authorId);
    const responsePost = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: author.id,
        username: author.username,
        role: author.role,
      },
    };

    return res.json(responsePost);
  }

  res.status(403).send("You do not have permission to update this post");
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: 게시글 삭제 (관리자 전용)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.delete("/posts/:id", verifyToken, checkRole(["admin"]), (req, res) => {
  const postId = parseInt(req.params.id);
  if (!postId) {
    return res.status(400).send("왜 숫자 안 적음?");
  }
  const initialLength = posts.length;
  posts = posts.filter((p) => p.id !== postId);

  if (posts.length < initialLength) {
    return res.status(204).send();
  }
  res.status(404).send("Post not found");
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *       500:
 *         description: 서버 오류
 */
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out, please try again");
    }
    res.send("Logged out successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`,
  );
});
