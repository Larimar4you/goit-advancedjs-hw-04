import './css/style.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;
const perPage = 15;

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

async function handleFormSubmit(event) {
  event.preventDefault();

  query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();

  await searchImages();
}

async function handleLoadMoreClick() {
  page += 1;
  hideLoadMoreButton();

  await searchImages();

  smoothScroll();
}

async function searchImages() {
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    const images = data.hits;
    totalHits = data.totalHits;

    if (images.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(images);

    const totalPages = Math.ceil(totalHits / perPage);

    if (page >= totalPages) {
      hideLoadMoreButton();

      if (page > 1) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }

      return;
    }

    showLoadMoreButton();
  } catch (error) {
    console.log(error);

    iziToast.error({
      message: 'Failed to load images. Please try again later.',
      position: 'topRight',
    });

    return false;
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const galleryItem = gallery.firstElementChild;

  if (!galleryItem) return;

  const cardHeight = galleryItem.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
