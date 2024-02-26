export const state = () => ({
  avatars: {}
})

export const mutations = {
  setAvatars (state, avatars) {
      state.avatars = avatars
  }
}

export const actions = {
  fetchAvatars ({ commit, state }) {
      if (Object.keys(state.avatars).length) {
          return state.avatars
      }

      let avatars = {}
      let files = require.context('~/static/avatars', true, /\.png$/i)
      files.keys().map((key) => {
          let id = key.split('/').pop().split('.')[0].substring(7).toUpperCase()
          avatars[id] = {
              path: key.split('/').pop(),
              id: id
          }
      })

      commit('setAvatars', avatars)
  }
}
