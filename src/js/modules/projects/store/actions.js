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
    create: (context, payload) => {
        axios({
            method: 'post',
            url: '/projects',
            data: payload,
        })
            .then(response => {
                context.commit('loadProject', response.data)
            })
            .catch(res => {
                console.log(res);
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