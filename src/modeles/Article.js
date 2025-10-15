import mongoose from "mongoose";
import { CATEGORY_KEYS, normalizeCategory } from "../constants/categories.js";

// --- Schéma Article ---
const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 180,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 220,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "SLSB",
      trim: true,
      maxlength: 80,
    },

    // 🔒 Catégorie OBLIGATOIRE (enum contrôlé)
    category: {
      type: String,
      required: true,
      lowercase: true,
      enum: CATEGORY_KEYS,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 40,
        index: true,
      },
    ],

    sections: {
      type: [String],
      default: ["blog"],
      validate: {
        validator: (arr) =>
          arr.every((s) => ["blog", "actu"].includes(String(s).toLowerCase())),
        message: "Section inconnue (valeurs autorisées : blog, actu)",
      },
      index: true,
    },

    date: { type: Date },
    location: { type: String, trim: true, maxlength: 120 },

    linkUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/i.test(v),
        message: "URL invalide",
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/i.test(v),
        message: "URL invalide",
      },
    },

    excerpt: { type: String, trim: true, maxlength: 400 },
    content: { type: String },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },

    seoTitle: { type: String, trim: true, maxlength: 180 },
    seoDescription: { type: String, trim: true, maxlength: 300 },
    ogImage: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/i.test(v),
        message: "URL invalide",
      },
    },

    readingTime: { type: Number, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Fonction utilitaire : slugify ---
function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, "")
    .trim()
    .replace(/\\s+/g, "-")
    .replace(/-+/g, "-");
}

// --- Hook de validation ---
ArticleSchema.pre("validate", function (next) {
  // Normalise la catégorie
  this.category = normalizeCategory(this.category);

  if (!this.category) {
    return next(
      new Error("La catégorie est requise et doit être une valeur autorisée.")
    );
  }

  // Génère le slug automatiquement si absent
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

// --- Indexes ---
ArticleSchema.index({ category: 1, slug: 1 }, { unique: true });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ createdAt: -1 });

// --- Export du modèle (évite les doublons avec Mongoose en hot reload) ---
export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);