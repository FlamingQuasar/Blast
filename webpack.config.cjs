const path = require("path");

module.exports = {
  entry: "./src/core/blastGame.js",
  mode: "development",
  output: {
    filename: "./view/htmlClient/compiled/MAIN.js"
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './view/htmlClient'),
      watch: true
    },
  /*devServer: {
    contentBase: path.join(__dirname, "src/view/htmlClient"),
    compress: true,
    port: 9000,
    watchContentBase: true,
    progress: true
  },*/
 /* module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }*/
}
}