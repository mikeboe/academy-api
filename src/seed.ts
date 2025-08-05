import "dotenv/config";
import { db } from "./db";
import { courses, levels, categories, chapters } from "./schema/course-schema";

const USER_ID = "23a8dac8-0ae2-4e76-8141-42a0e9b7f60f";

const seedLevels = [
  { name: "Beginner" },
  { name: "Intermediate" },
  { name: "Advanced" }
];

const seedCategories = [
  { name: "Machine Learning", description: "Courses focused on machine learning algorithms and applications" },
  { name: "Deep Learning", description: "Advanced neural network architectures and deep learning techniques" },
  { name: "Natural Language Processing", description: "Text processing, language understanding, and chatbot development" },
  { name: "Computer Vision", description: "Image processing, object detection, and visual recognition systems" },
  { name: "AI Ethics", description: "Responsible AI development and ethical considerations" },
  { name: "Reinforcement Learning", description: "Decision-making algorithms and intelligent agent development" }
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Insert levels
    console.log("Seeding levels...");
    const insertedLevels = await db.insert(levels).values(seedLevels).returning();
    console.log(`Created ${insertedLevels.length} levels`);

    // Insert categories
    console.log("Seeding categories...");
    const insertedCategories = await db.insert(categories).values(seedCategories).returning();
    console.log(`Created ${insertedCategories.length} categories`);

    // Create level and category maps for easy lookup
    const levelMap = insertedLevels.reduce((acc, level) => {
      acc[level.name] = level.id;
      return acc;
    }, {} as Record<string, string>);

    const categoryMap = insertedCategories.reduce((acc, category) => {
      acc[category.name] = category.id;
      return acc;
    }, {} as Record<string, string>);

    // Seed courses
    const seedCourses = [
      {
        title: "Machine Learning Fundamentals",
        description: "Master the basics of machine learning with hands-on projects and real-world applications.",
        level: levelMap["Beginner"],
        category: categoryMap["Machine Learning"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      },
      {
        title: "Deep Learning with Neural Networks",
        description: "Dive deep into neural networks, CNNs, RNNs, and build sophisticated AI models.",
        level: levelMap["Advanced"],
        category: categoryMap["Deep Learning"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      },
      {
        title: "Natural Language Processing",
        description: "Learn to build chatbots, sentiment analysis, and language understanding systems.",
        level: levelMap["Intermediate"],
        category: categoryMap["Natural Language Processing"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      },
      {
        title: "Computer Vision Applications",
        description: "Build image recognition, object detection, and visual AI applications.",
        level: levelMap["Intermediate"],
        category: categoryMap["Computer Vision"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      },
      {
        title: "AI Ethics and Responsible Development",
        description: "Understand the ethical implications and responsible practices in AI development.",
        level: levelMap["Beginner"],
        category: categoryMap["AI Ethics"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      },
      {
        title: "Reinforcement Learning",
        description: "Master decision-making algorithms and build intelligent agents that learn from experience.",
        level: levelMap["Advanced"],
        category: categoryMap["Reinforcement Learning"],
        published: true,
        authorId: USER_ID,
        instructor: USER_ID,
        thumbnail: "/placeholder-course.jpg"
      }
    ];

    console.log("Seeding courses...");
    const insertedCourses = await db.insert(courses).values(seedCourses).returning();
    console.log(`Created ${insertedCourses.length} courses`);

    // Seed chapters for the first course (Machine Learning Fundamentals)
    const mlCourse = insertedCourses.find(course => course.title === "Machine Learning Fundamentals");
    if (mlCourse) {
      const seedChapters = [
        {
          courseId: mlCourse.id,
          title: "Introduction to Machine Learning",
          description: "Learn the foundations and key concepts of ML",
          position: 1,
          published: true,
          authorId: USER_ID,
          content: "This chapter covers the fundamental concepts of machine learning including supervised, unsupervised, and reinforcement learning paradigms.",
          duration: 45,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: mlCourse.id,
          title: "Data Preprocessing",
          description: "Clean and prepare data for machine learning models",
          position: 2,
          published: true,
          authorId: USER_ID,
          content: "Learn essential data preprocessing techniques including handling missing values, feature scaling, and data transformation.",
          duration: 60,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: mlCourse.id,
          title: "Supervised Learning",
          description: "Understanding classification and regression algorithms",
          position: 3,
          published: true,
          authorId: USER_ID,
          content: "Explore supervised learning algorithms including linear regression, decision trees, and support vector machines.",
          duration: 75,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: mlCourse.id,
          title: "Unsupervised Learning",
          description: "Clustering and dimensionality reduction techniques",
          position: 4,
          published: true,
          authorId: USER_ID,
          content: "Discover unsupervised learning methods such as k-means clustering, hierarchical clustering, and PCA.",
          duration: 70,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: mlCourse.id,
          title: "Model Evaluation",
          description: "Techniques for evaluating and improving model performance",
          position: 5,
          published: true,
          authorId: USER_ID,
          content: "Learn how to evaluate model performance using cross-validation, confusion matrices, and various metrics.",
          duration: 55,
          thumbnail: "/placeholder-chapter.jpg"
        }
      ];

      console.log("Seeding chapters...");
      const insertedChapters = await db.insert(chapters).values(seedChapters).returning();
      console.log(`Created ${insertedChapters.length} chapters for Machine Learning Fundamentals`);
    }

    // Seed chapters for Deep Learning course
    const dlCourse = insertedCourses.find(course => course.title === "Deep Learning with Neural Networks");
    if (dlCourse) {
      const deepLearningChapters = [
        {
          courseId: dlCourse.id,
          title: "Neural Network Fundamentals",
          description: "Basic concepts of neural networks and perceptrons",
          position: 1,
          published: true,
          authorId: USER_ID,
          content: "Introduction to artificial neurons, activation functions, and basic neural network architecture.",
          duration: 65,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: dlCourse.id,
          title: "Backpropagation and Training",
          description: "How neural networks learn through backpropagation",
          position: 2,
          published: true,
          authorId: USER_ID,
          content: "Understanding gradient descent, backpropagation algorithm, and training neural networks effectively.",
          duration: 80,
          thumbnail: "/placeholder-chapter.jpg"
        },
        {
          courseId: dlCourse.id,
          title: "Convolutional Neural Networks",
          description: "CNNs for image processing and computer vision",
          position: 3,
          published: true,
          authorId: USER_ID,
          content: "Learn about convolutional layers, pooling, and building CNNs for image classification tasks.",
          duration: 90,
          thumbnail: "/placeholder-chapter.jpg"
        }
      ];

      const dlChapters = await db.insert(chapters).values(deepLearningChapters).returning();
      console.log(`Created ${dlChapters.length} chapters for Deep Learning course`);
    }

    console.log("Database seeding completed successfully!");
    
    // Print summary
    console.log("\n=== SEEDING SUMMARY ===");
    console.log(`Levels: ${insertedLevels.length}`);
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Courses: ${insertedCourses.length}`);
    
    // Count total chapters
    const totalChapters = await db.select().from(chapters);
    console.log(`Chapters: ${totalChapters.length}`);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("Seeding process completed");
  process.exit(0);
}).catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});