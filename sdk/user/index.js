const a = window.canva.authentication;
export const auth = Object.freeze({
  requestAuthentication: a.requestAuthentication.bind(a),
  getCanvaUserToken: a.getCanvaUserToken.bind(a),
});
