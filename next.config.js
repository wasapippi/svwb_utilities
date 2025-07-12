// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // GitHub Pages対応のための静的エクスポート
  trailingSlash: true, // 出力パス末尾にスラッシュをつける（GH Pages向け）
    basePath: '/svwb_utilities', // GitHubリポジトリの名前に置き換える
  images: { unoptimized: true }, // Mantineの画像周り最適化を避ける
};

module.exports = nextConfig;