import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { getBlogPost } from "./data";
import ArticleLayout from "./components/ArticleLayout";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogPost(slug) : null;

  usePageMeta(
    post
      ? {
          title: `${post.title} | Solutions Blog`,
          description: post.excerpt,
          ogImage: post.ogImage,
          canonical: `https://devcraft.studio/blog/${post.slug}`,
        }
      : {
          title: "Article Not Found | Solutions Blog",
          description: "The article you're looking for doesn't exist.",
        }
  );

  useEffect(() => {
    if (!post) window.scrollTo({ top: 0, behavior: "instant" });
  }, [post]);

  if (!post) {
    return (
      <div className="bg-[#080d1a] min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-full mx-auto mb-6">
            <i className="ri-file-unknow-line text-white/30 text-2xl" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-3">Article not found</h1>
          <p className="text-white/40 text-base mb-8">
            This article doesn&apos;t exist or may have been moved.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 bg-accent text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line" />
            Back to Blog
          </button>
        </motion.div>
      </div>
    );
  }

  return <ArticleLayout post={post} />;
}