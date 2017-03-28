import axios from 'axios';
export default {
    load: (context) => {
        axios.get('/projects')
            .then(response => {
                context.commit('load', response.data)
            });
    },
    loadProject: (context, payload) => {
        axios.get('/projects/' + payload)
            .then(response => {
                context.commit('loadProject', response.data)
            });
    },
    saveProjectData(state, payload, aa) {
        axios.post('/projects/' + payload.id + '/data', payload.formData);
    }
}