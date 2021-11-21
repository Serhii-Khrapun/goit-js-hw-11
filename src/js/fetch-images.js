import axios from 'axios';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

   async fetchImages() {
        const BASE_URL = 'https://pixabay.com';
        const KEY = '24443838-ead6510e85d5ce0a082bd02f6';
        const getImg = await axios.get(`${BASE_URL}/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
        this.incrementPage();
        
        return getImg;
          }   


    resetPage() {
        this.page = 1;
    }

    incrementPage() {
        this.page += 1;
    }

    decrementPage() {
        this.page -= 1;
    }
    
  

}