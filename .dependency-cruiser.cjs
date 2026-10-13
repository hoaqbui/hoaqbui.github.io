/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "content-pure",
      severity: "error",
      comment:
        "from ^src/content may not import anything under ^src/ (other than src/content itself) and may not import the npm packages react, react-dom, next, motion.",
      from: {
        path: "^src/content"
      },
      to: {
        path: [
          "^src/(?!content)",
          "^node_modules/.*(react|react-dom|next|motion)",
          "^(react|react-dom|next|motion)($|/)"
        ]
      }
    },
    {
      name: "no-upward",
      severity: "error",
      comment: "from ^src/(ui|fx) may not import ^src/(sections|app).",
      from: {
        path: "^src/(ui|fx)"
      },
      to: {
        path: "^src/(sections|app)"
      }
    },
    {
      name: "sections-isolated",
      severity: "error",
      comment:
        "a file in ^src/sections/ may not import a different file in ^src/sections/ (files in the same section folder are not a concern; there are only top-level files like src/sections/Hero.tsx).",
      from: {
        path: "^src/sections/([^/]+)"
      },
      to: {
        path: "^src/sections/([^/]+)",
        pathNot: "^src/sections/$1"
      }
    },
    {
      name: "motion-gated",
      severity: "error",
      comment:
        "only files under ^src/(fx|ui) may import the npm package `motion` (any path starting motion/ or exactly motion); every other path under ^src/ is forbidden from it.",
      from: {
        path: "^src/",
        pathNot: "^src/(fx|ui)"
      },
      to: {
        path: [
          "^node_modules/.*motion",
          "^motion($|/)"
        ]
      }
    }
  ],
  options: {
    doNotFollow: "node_modules",
    tsConfig: {
      fileName: "tsconfig.json"
    },
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".mjs"]
    }
  }
};
