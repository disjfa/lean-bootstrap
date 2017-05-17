import axios from 'axios';
export default {
    load: (context) => {
        context.commit('isFetching');
        axios.get('/user')
            .then(response => {
                context.commit('load', response.data)
            });
    },
}