import Article from "../../modeles/Article.js";
import { normalizeCategory } from "../../constants/categories.js";

// LIST with filters: q, category, section, status
export async function listArticles({ q, limit = 20, skip = 0, category, section, status }) {
  const filter = {};

  if (q) {
    filter.$or = [
      { title:   { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags:    { $regex: q, $options: "i" } },
    ];
  }

  if (category) {
    const c = normalizeCategory(category);
    if (!c) throw Object.assign(new Error("Catégorie inconnue"), { status: 400 });
    filter.category = c;
  }

  if (section) filter.sections = section;                // "blog" | "actu"
  if (status)  filter.status  = status;                  // "draft" | "published" | "archived"

  const [items, total] = await Promise.all([
    Article.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Article.countDocuments(filter),
  ]);
  return { items, total };
}

export async function getArticleBySlug(slug) {
  return Article.findOne({ slug });
}

// NEW: get by (category, slug)
export async function getArticleByCategoryAndSlug(category, slug) {
  const c = normalizeCategory(category);
  if (!c) throw Object.assign(new Error("Catégorie inconnue"), { status: 400 });
  return Article.findOne({ category: c, slug });
}

export async function createArticle(payload) {
  return Article.create(payload);
}

export async function updateArticle(slug, payload) {
  return Article.findOneAndUpdate({ slug }, payload, { new: true });
}

export async function removeArticle(slug) {
  return Article.findOneAndDelete({ slug });
}