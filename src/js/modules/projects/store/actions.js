import axios from 'axios';
export default {
    load: (context) => {
        axios.get('/projects')
            .then(response => {
                context.commit('load', response.data)
            })
    }
}