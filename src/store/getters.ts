const getters = {
  permissionRoutes: (state) => state.permission.routes,
  roles: (state) => state.user.roles,
  avatar: (state) => state.user.avatar,
  sidebar: (state) => state.app.sidebar,
}

export default getters
