import { Request, Response } from 'express';
import { db } from '../db';
import { courses, levels, categories, chapters, createCourseSchema, updateCourseSchema, courseSearchSchema, createCategorySchema, updateCategorySchema, createLevelSchema, updateLevelSchema, createChapterSchema, updateChapterSchema } from '../schema/course-schema';
import { eq, and, or, like, desc, asc, count } from 'drizzle-orm';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const validation = createCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const data = validation.data;

    const newCourse = await db.insert(courses).values({
      ...data,
      publishedAt: data.published ? new Date() : null
    }).returning();

    res.status(201).json(newCourse[0]);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const validation = courseSearchSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const { query, category, level, authorId, published, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (query) {
      whereConditions.push(
        or(
          like(courses.title, `%${query}%`),
          like(courses.description, `%${query}%`)
        )
      );
    }
    
    if (category) {
      whereConditions.push(eq(courses.category, category));
    }
    
    if (level) {
      whereConditions.push(eq(courses.level, level));
    }
    
    if (authorId) {
      whereConditions.push(eq(courses.authorId, authorId));
    }
    
    if (published !== undefined) {
      whereConditions.push(eq(courses.published, published));
    }

    const coursesList = await db.select()
      .from(courses)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(courses.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db.select({ count: count() })
      .from(courses)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = totalCountResult[0].count;

    res.json({
      data: coursesList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await db.select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!course.length) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    res.json(course[0]);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const validation = updateCourseSchema.safeParse({ ...req.body, id: req.params.id });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const { id, ...updateData } = validation.data;

    const existingCourse = await db.select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!existingCourse.length) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.published !== undefined 
        ? (updateData.published ? new Date() : null)
        : existingCourse[0].publishedAt
    };

    const updatedCourse = await db.update(courses)
      .set(updatedData)
      .where(eq(courses.id, id))
      .returning();

    res.json(updatedCourse[0]);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCourse = await db.select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!existingCourse.length) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    await db.delete(courses).where(eq(courses.id, id));

    res.status(204).end();
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const newCategory = await db.insert(categories).values(validation.data).returning();

    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoriesList = await db.select().from(categories).orderBy(asc(categories.name));

    res.json(categoriesList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const validation = updateCategorySchema.safeParse({ ...req.body, id: req.params.id });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const { id, ...updateData } = validation.data;

    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existingCategory.length) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    const updatedCategory = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    res.json(updatedCategory[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existingCategory.length) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    await db.delete(categories).where(eq(categories.id, id));

    res.status(204).end();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const createLevel = async (req: Request, res: Response) => {
  try {
    const validation = createLevelSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const newLevel = await db.insert(levels).values(validation.data).returning();

    res.status(201).json(newLevel[0]);
  } catch (error) {
    console.error('Create level error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getLevels = async (req: Request, res: Response) => {
  try {
    const levelsList = await db.select().from(levels).orderBy(asc(levels.name));

    res.json(levelsList);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const updateLevel = async (req: Request, res: Response) => {
  try {
    const validation = updateLevelSchema.safeParse({ ...req.body, id: req.params.id });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const { id, ...updateData } = validation.data;

    const existingLevel = await db.select()
      .from(levels)
      .where(eq(levels.id, id))
      .limit(1);

    if (!existingLevel.length) {
      return res.status(404).json({
        message: 'Level not found'
      });
    }

    const updatedLevel = await db.update(levels)
      .set(updateData)
      .where(eq(levels.id, id))
      .returning();

    res.json(updatedLevel[0]);
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const deleteLevel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingLevel = await db.select()
      .from(levels)
      .where(eq(levels.id, id))
      .limit(1);

    if (!existingLevel.length) {
      return res.status(404).json({
        message: 'Level not found'
      });
    }

    await db.delete(levels).where(eq(levels.id, id));

    res.status(204).end();
  } catch (error) {
    console.error('Delete level error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const createChapter = async (req: Request, res: Response) => {
  try {
    const validation = createChapterSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const data = validation.data;

    const newChapter = await db.insert(chapters).values({
      ...data,
      publishedAt: data.published ? new Date() : null
    }).returning();

    res.status(201).json(newChapter[0]);
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getChaptersByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const chaptersList = await db.select()
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .orderBy(asc(chapters.position));

    res.json(chaptersList);
  } catch (error) {
    console.error('Get chapters by course error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const getChapterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chapter = await db.select()
      .from(chapters)
      .where(eq(chapters.id, id))
      .limit(1);

    if (!chapter.length) {
      return res.status(404).json({
        message: 'Chapter not found'
      });
    }

    res.json(chapter[0]);
  } catch (error) {
    console.error('Get chapter by ID error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  try {
    const validation = updateChapterSchema.safeParse({ ...req.body, id: req.params.id });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    const { id, ...updateData } = validation.data;

    const existingChapter = await db.select()
      .from(chapters)
      .where(eq(chapters.id, id))
      .limit(1);

    if (!existingChapter.length) {
      return res.status(404).json({
        message: 'Chapter not found'
      });
    }

    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.published !== undefined 
        ? (updateData.published ? new Date() : null)
        : existingChapter[0].publishedAt
    };

    const updatedChapter = await db.update(chapters)
      .set(updatedData)
      .where(eq(chapters.id, id))
      .returning();

    res.json(updatedChapter[0]);
  } catch (error) {
    console.error('Update chapter error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingChapter = await db.select()
      .from(chapters)
      .where(eq(chapters.id, id))
      .limit(1);

    if (!existingChapter.length) {
      return res.status(404).json({
        message: 'Chapter not found'
      });
    }

    await db.delete(chapters).where(eq(chapters.id, id));

    res.status(204).end();
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};