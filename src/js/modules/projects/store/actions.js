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
        axios({
            method: 'post',
            url: '/projects/' + payload.id + '/data',
            data: payload.formData,
        })
            .then(response => {
                console.log(response);
            })
            .catch(res => {
                console.log(res);
            });
    }
}