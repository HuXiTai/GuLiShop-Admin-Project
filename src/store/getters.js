const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
<<<<<<< HEAD
  routes: state => state.user.routes,
  buttons: state => state.user.buttons,
  roles: state => state.user.roles
=======
  buttons: state => state.user.buttons,
  roles: state => state.user.roles,
  routes: state => state.user.routes
>>>>>>> bb67d2dfa5699bf056a87e0e1de606fa135323eb
};
export default getters;
