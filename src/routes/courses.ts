import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createLevel,
  getLevels,
  updateLevel,
  deleteLevel,
  createChapter,
  getChaptersByCourse,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../controllers/course";

const router = Router();

// Category routes (must come before /:id)
router.post(
  "/categories",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  createCategory
);
router.get("/categories", getCategories);
router.put(
  "/categories/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  updateCategory
);
router.delete(
  "/categories/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  deleteCategory
);

// Level routes (must come before /:id)
router.post(
  "/levels",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  createLevel
);
router.get("/levels", getLevels);
router.put(
  "/levels/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  updateLevel
);
router.delete(
  "/levels/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  deleteLevel
);

// Chapter routes (must come before /:id)
router.post(
  "/chapters",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  createChapter
);
router.get("/chapters/:id", getChapterById);
router.put(
  "/chapters/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  updateChapter
);
router.delete(
  "/chapters/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  deleteChapter
);

// Course routes (generic routes come last)
router.post(
  "/",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  createCourse
);
router.get("/", getCourses);
router.get("/:courseId/chapters", getChaptersByCourse);
router.get("/:id", getCourseById);
router.put(
  "/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  updateCourse
);
router.delete(
  "/:id",
  authMiddleware,
  authLimiter,
  roleMiddleware(["admin"]),
  deleteCourse
);

export default router;
