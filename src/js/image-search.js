import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './fetch-images';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchBtn: document.querySelector('.search-form > button'),
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  body: document.querySelector('body'),
};
const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  const good = await imagesApiService.fetchImages();
  const totalHits = good.data.totalHits;
  const hitsLength = good.data.hits.length;

  if (totalHits < 1) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  } else if (imagesApiService.searchQuery.trim() === '') {
    Notify.warning('Enter your serch query, please :)');
    return;
  } else {
    refs.body.style.background = '#ffffff';
    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.imagesContainer.innerHTML = '';

    imagesApiService.resetPage();
    await imagesApiService.fetchImages().then(renderPosts);

    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.removeAttribute('disabled');
    if (hitsLength < 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  }
}

async function onLoadMore() {
  if (imagesApiService.page !== 2) {
    imagesApiService.decrementPage();
  }

  await imagesApiService.fetchImages().then(renderPosts);
  const good = await imagesApiService.fetchImages();
  const hitsLength = good.data.hits.length;

  if (hitsLength < 40) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 + 180,
    behavior: 'smooth',
  });
}

function renderPosts(getImg) {
  const markup = getImg.data.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="392" height="264"/>
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes <span class="nums"> ${likes} </span></b>
              </p>
              <p class="info-item">
                <b>Views <span class="nums"> ${views} </span></b>
              </p>
              <p class="info-item">
                <b>Comments <span class="nums"> ${comments} </span></b>
              </p>
              <p class="info-item">
                <b>Downloads <span class="nums"> ${downloads} </span></b>
              </p>
            </div>
          </div>`;
    })
    .join('');
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
  refs.loadMoreBtn.classList.remove('is-hidden');
}
