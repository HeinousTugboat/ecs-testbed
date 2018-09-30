function requireAll(requireContext: __WebpackModuleApi.RequireContext) {
  return requireContext.keys().map(requireContext);
}
const pages = requireAll(require.context('./views', true, /\.pug$/));

require('./scss/index.scss');
