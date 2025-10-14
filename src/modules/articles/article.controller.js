import * as svc from "./article.service.js";

export async function getAll(req, res, next) {
  try {
    const { q, limit, skip, category, section, status } = req.query;
    const data = await svc.listArticles({
      q,
      limit: Number(limit) || 20,
      skip: Number(skip) || 0,
      category,
      section,
      status,
    });
    res.json(data);
  } catch (e) { next(e); }
}

export async function getOne(req, res, next) {
  try {
    const { slug } = req.params;
    const doc = await svc.getArticleBySlug(slug);
    if (!doc) return res.status(404).json({ error: "Article introuvable" });
    res.json(doc);
  } catch (e) { next(e); }
}

// 👉 nouvel handler: récupérer un article par (category, slug)
export async function getOneByCategory(req, res, next) {
  try {
    const { category, slug } = req.params;
    const doc = await svc.getArticleByCategoryAndSlug(category, slug);
    if (!doc) return res.status(404).json({ error: "Article introuvable" });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const doc = await svc.createArticle(req.body);
    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const { slug } = req.params;
    const doc = await svc.updateArticle(slug, req.body);
    if (!doc) return res.status(404).json({ error: "Article introuvable" });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const { slug } = req.params;
    const doc = await svc.removeArticle(slug);
    if (!doc) return res.status(404).json({ error: "Article introuvable" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}