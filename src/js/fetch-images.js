import axios from 'axios';

const API_KEY = '24443838-ead6510e85d5ce0a082bd02f6';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default {
  searchQuery: '',
  page: 1,
  perPage: 40,

  async fetchImage() {
    try {
      let response = await axios.get(
        `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=${this.perPage}&key=${API_KEY}`,
      );
      let data = await response.data;
      this.incrementPage();

      return data;
    } catch (error) {
      console.error(error);
    }
  },

  incrementPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },
  decrementPage() {
    this.page -= 1;
  },

  get query() {
    return this.searchQuery;
  },

  set query(newQuery) {
    this.searchQuery = newQuery;
  },
};
