import axios from 'axios';

export default {
  clearError: (context) => {
    context.commit('clearError');
  },
  load: (context) => {
    context.commit('isFetching');
    axios.get('/projects')
      .then((response) => {
        context.commit('load', response.data);
      });
  },
  loadMyProjects: (context) => {
    context.commit('isFetching');
    axios.get('/projects/my')
      .then((response) => {
        context.commit('load', response.data);
      })
      .catch(() => {
        context.commit('notallowed');
      });
  },
  loadProject: (context, payload) => {
    context.commit('isFetching');
    axios.get(`/projects/${payload}`)
      .then((response) => {
        context.commit('loadProject', response.data);
      });
  },
  create: (context, payload) => {
    context.commit('isFetching');
    axios({
      method: 'post',
      url: '/projects',
      data: payload,
    })
      .then((response) => {
        context.commit('loadProject', response.data);
      })
      .catch(() => {
        // console.log(res);
      });
  },
  saveProjectSettings(context, payload) {
    context.commit('isFetching');
    axios({
      method: 'post',
      url: `/projects/${payload.id}/settings`,
      data: {
        name: payload.name,
        settings: payload.settings,
      },
    })
      .then(() => {
        context.commit('fetchingIsDone');
      })
      .catch(() => {
        // console.log(error.response);
      });
  },
  saveProjectData(context, payload) {
    context.commit('isFetching');
    axios({
      method: 'post',
      url: `/projects/${payload.id}`,
      data: {
        data: payload.formData,
      },
    })
      .then(() => {
        context.commit('fetchingIsDone');
      })
      .catch((error) => {
        context.commit('error', error.response.data.message);
      });
  },
};
