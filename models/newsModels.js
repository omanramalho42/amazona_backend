import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
  },
  {
    timestamps: true
  }
)

const News = mongoose.model('News', newsSchema);
export default News;