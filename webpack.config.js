var webpack = require('webpack')

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!bootstrap/dist/js/bootstrap.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    alias: {
      applicationStyles: 'app/styles/app.scss',
      About: 'app/components/About.jsx',
      AdminProfile: 'app/components/admin/AdminProfile.jsx',
      Checkout: 'app/components/Checkout.jsx',
      CustomerLogin: 'app/components/customer/CustomerLogin.jsx',
      CustomerProfile: 'app/components/customer/CustomerProfile.jsx',
      EmployeeLogin: 'app/components/employee/EmployeeLogin.jsx',
      EmployeeProfile: 'app/components/employee/EmployeeProfile.jsx',
      Failure: 'app/components/payment/Failure.jsx',
      ForgotPassword: 'app/components/password/ForgotPassword.jsx',
      Home: 'app/components/Home.jsx',
      Login: 'app/components/Login.jsx',
      Main: 'app/components/Main.jsx',
      Map: 'app/components/Map.jsx',
      Navigation: 'app/components/Navigation.jsx',
      Playground: 'app/components/Playground.jsx',
      Popup: 'app/components/Popup.jsx',
      ResetPassword: 'app/components/password/ResetPassword.jsx',
      Routes: 'app/components/Routes.jsx',
      Success: 'app/components/payment/Success.jsx'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // loader: "url?limit=10000"
        loader: "url"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      }
    ]
  },
  devtool: 'inline-source-map'
};
