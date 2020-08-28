export default {
  '/mocker.api': {
    target: 'http://202.98.157.34:8100/mock/5e69c69a537a66a0f4eccce8/sei-dashboard-service',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/api-gateway': {
    target: 'http://dsei.changhong.com/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
