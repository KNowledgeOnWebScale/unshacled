module.exports = {
  presets: ["@vue/app"],
  plugins: [
    ["@babel/plugin-transform-runtime", { corejs: 3 }],
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-default-from",
    ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    [
      "module-resolver",
      {
        /** Module aliases. */
        alias: {
          // Util
          Traverse: "./src/util/traverse",
          Examples: "./src/util/examples",
          // Translate
          ShaclDictionary: "./src/translation/shaclDictionary",
          ShaclTranslator: "./src/translation/shaclTranslator"
        }
      }
    ]
  ]
};
