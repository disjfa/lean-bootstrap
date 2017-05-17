import axios from 'axios'
export default {
  load: (context) => {
    context.commit('isFetching')
    axios.get('/projects')
      .then(response => {
        context.commit('load', response.data)
      })
  },
  loadMyProjects: (context) => {
    context.commit('isFetching')
    axios.get('/projects/my')
      .then(response => {
        context.commit('load', response.data)
      })
      .catch(res => {
        console.log(res)
      })
  },
  loadProject: (context, payload) => {
    context.commit('isFetching')
    axios.get('/projects/' + payload)
      .then(response => {
        context.commit('loadProject', response.data)
      })
  },
  create: (context, payload) => {
    context.commit('isFetching')
    axios({
      method: 'post',
      url: '/projects',
      data: payload,
    })
      .then(response => {
        context.commit('loadProject', response.data)
      })
      .catch(res => {
        console.log(res)
      })
  },
  saveProjectSettings(context, payload) {
    context.commit('isFetching')
    axios({
      method: 'post',
      url: '/projects/' + payload.id + '/settings',
      data: {
        name: payload.name,
        settings: payload.settings,
      },
    })
      .then(response => {
        context.commit('fetchingIsDone')
      })
      .catch(res => {
        console.log(res)
      })
  },
  saveProjectData(context, payload) {
    context.commit('isFetching')
    axios({
      method: 'post',
      url: '/projects/' + payload.id,
      data: {
        data: payload.formData,
      },
    })
      .then(response => {
        context.commit('fetchingIsDone')
      })
      .catch(res => {
        console.log(res)
      })
  }
}