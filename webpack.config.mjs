// webpack.config.mjs

import path from "path";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import Dotenv from "dotenv-webpack";
// import CopyWebpackPlugin from "copy-webpack-plugin";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

// POSTCSS
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";
import postcssPresetEnv from "postcss-preset-env";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default (_env, argv) => {
  const isProduction = argv.mode === "production";
  const publicPath = isProduction
    ? new URL(pkg.homepage).pathname.replace(/\/?$/, "/")
    : "/";

  return {
    mode: isProduction ? "production" : "development",
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction, // console.logs nur in Produktion entfernen
            },
            format: {
              comments: false, // entfernt alle Kommentare (auch Lizenz)
            },
          },
          extractComments: false, // keine LICENSE-Datei extrahieren
        }),
        // Minimizer für CSS (affects tw)
        new CssMinimizerWebpackPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        chunks: "all", // Teilt alle Arten von Chunks auf (dynamische & initiale)
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
    // Einstiegspunkt der Anwendung (TypeScript React)
    entry: "./src/index.tsx",
    output: {
      // filename: "bundle.js", // Ergebnis-Datei ohne splitChunks und Cache-Busting/[contentHash]
      filename: (pathData) => {
        if (pathData.chunk.name === "vendor") {
          return "vendor.[contenthash].js";
        }
        return "[name].[contenthash].js";
      },
      chunkFilename: "chunk.[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: publicPath,
      clean: true, // Dist-Ordner vor Build löschen
    },
    // Welche Datei-Endungen beim Import aufgelöst werden sollen
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    // Dev-Server für lokale Entwicklung
    devServer: {
      static: "./dist",
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        // TypeScript und TSX-Dateien mit ts-loader verarbeiten
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        // CSS-Dateien mit style-loader & css-loader einbinden
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                // Konfiguration der PostCSS-Plugins direkt hier
                postcssOptions: {
                  plugins: [
                    // Hier werden die PostCSS-Plugins direkt angewendet
                    tailwindcss(),
                    postcssImport(),
                    postcssNested(),
                    postcssPresetEnv({
                      features: {
                        "color-mix": false,
                        "custom-properties": false,
                      },
                    }),
                    autoprefixer(),
                    postcssCombineDuplicatedSelectors(),
                  ],
                },
              },
            },
          ],
        },
        // Fonts (woff2, ttf, otf, eot) als separate Dateien ausgeben
        {
          test: /\.(woff2?|ttf|otf|eot)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]", // z.B. fonts/InterVariable.woff2
          },
        },
        // Bilder (png, jpg, jpeg, gif, svg) als separate Dateien ausgeben

        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        publicPath,
      }),
      // Das Plugin nur im Produktionsmodus hinzufügen
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "styles.[contenthash].css", // Dateiname der extrahierten CSS-Datei
        }),
      // Dotenv Plugin zum Laden der .env Datei
      new Dotenv({
        path: "./.env",
        safe: false,
        systemvars: true,
        silent: false,
      }),
      // new BundleAnalyzerPlugin(),
    ].filter(Boolean), // Filtert "falsy" Werte (z.B. `false`) aus dem Array
  };
};
