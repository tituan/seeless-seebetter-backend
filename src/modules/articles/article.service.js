import Article from "../../modeles/Article.js";

export async function listArticles({ q, limit = 20, skip = 0 }) {
  const filter = {};
  if (q) {
    filter.$or = [
      { title:   { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags:    { $regex: q, $options: "i" } }
    ];
  }
  const [items, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Article.countDocuments(filter),
  ]);
  return { items, total };
}

export async function getArticleBySlug(slug) {
  return Article.findOne({ slug });
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