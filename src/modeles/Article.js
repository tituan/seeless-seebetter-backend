import mongoose from "mongoose";

// util simple pour slugifier un titre
function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")    // caractères spéciaux
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const urlValidator = {
  validator: (v) => !v || /^https?:\/\/.+/i.test(v),
  message: "URL invalide (doit commencer par http:// ou https://)",
};

const ArticleSchema = new mongoose.Schema(
  {
    // Identité & routing
    title:      { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    subtitle:   { type: String, trim: true, maxlength: 220 },
    slug:       { type: String, unique: true, sparse: true, lowercase: true, index: true },

    // Meta éditoriales
    author:     { type: String, default: "SLSB", trim: true, maxlength: 80 },
    category:   {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      // libre, mais tu peux figer une liste si tu veux :
      // enum: ["mode","musique","shopping","art","food","travel","tech","lifestyle","autre"]
    },
    tags:       [{ type: String, trim: true, lowercase: true, maxlength: 40, index: true }],

    // Placement / sections
    sections:   {
      type: [String], // ex. ["blog"] ou ["blog","actu"]
      default: ["blog"],
      validate: {
        validator: (arr) => arr.every(s => ["blog", "actu"].includes(String(s).toLowerCase())),
        message: "Section inconnue (valeurs autorisées : blog, actu)",
      },
      index: true,
    },

    // Infos de contexte
    date:       { type: Date },             // date éditoriale affichée (peut différer de createdAt)
    location:   { type: String, trim: true, maxlength: 120 }, // lieu (Paris, etc.)

    // Liens & médias
    linkUrl:    { type: String, trim: true, validate: urlValidator }, // lien externe si besoin
    imageUrl:   { type: String, trim: true, validate: urlValidator }, // visuel de couverture

    // Contenu
    excerpt:    { type: String, trim: true, maxlength: 400 },
    content:    { type: String }, // markdown/HTML/texte riche selon ton front

    // Publication
    status:     { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    publishedAt:{ type: Date },

    // SEO (optionnel mais pratique)
    seoTitle:       { type: String, trim: true, maxlength: 180 },
    seoDescription: { type: String, trim: true, maxlength: 300 },
    ogImage:        { type: String, trim: true, validate: urlValidator },

    // Divers
    readingTime: { type: Number, min: 0 }, // en minutes, si tu veux l’afficher
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slug auto si absent, ou régénérable si tu veux
ArticleSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

// Published helper
ArticleSchema.virtual("isPublished").get(function () {
  return this.status === "published";
});

// Index recos
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, publishedAt: -1 });

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);