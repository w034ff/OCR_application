module.exports = {
    env: {
      browser: true,
      es2023: true,
      node: true,
    },
    extends: [
      // "plugin:react/recommended",
      'airbnb',
      "airbnb/hooks",
      "airbnb-typescript",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      'prettier',
      ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      // ecmaFeatures: {
      //   jsx: true,
      // },
      sourceType: "module",
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json"],
    },
    plugins: ['prettier', "react", "@typescript-eslint"],
    rules: {
      'prettier/prettier': 'error',
      'no-alert': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      "import/extensions": [
        "error",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-cycle": "off",
      "no-use-before-define": "off",
      "react/destructuring-assignment": ["error", "never"],
      "react/jsx-filename-extension": [
        2,
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "react/jsx-props-no-spreading": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["./src"],
        },
      },
    },
  };