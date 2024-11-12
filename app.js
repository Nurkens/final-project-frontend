const headlineImage = document.querySelector('.main-headline-img');
const headlineTitle = document.querySelector('.main-headline-title');
const headlineDescription = document.querySelector('.main-headline-description');
const topImage = document.querySelector('.top-headline-img');
const topTitle = document.querySelector('.top-headline-title');
const topDescription = document.querySelector('.top-headline-description');
const topHeadlines = document.querySelector('.headlines-right');
const health = document.querySelector('.health');
const science = document.querySelector('.science');
const sports = document.querySelector('.sports');
const technology = document.querySelector('.technology');
const entertainment = document.querySelector('.entertainment');

const modal = document.getElementById('article-modal');
const modalTitle = document.getElementById('modal-article-title');
const modalImage = document.getElementById('modal-article-image');
const modalDescription = document.getElementById('modal-article-description');
const modalDate = document.getElementById('modal-article-date');
const modalTime = document.getElementById('modal-article-time');

const closeBtn = document.querySelector('.close-btn');

const apiKey = 'b801380550814a29b0e4f17e2e03fd09';

async function fetchNews(category = 'general') {
  try {
    const response = await fetch(`Articles.json`);
    const data = await response.json();

    switch (category) {
      case 'general':
        addHeadline(data);
        addTopNews(data);
        addHeadlines(data);
        break;
      case 'health':
        addCategoryNews(data, health, 'Health');
        break;
      case 'science':
        addCategoryNews(data, science, 'Science');
        break;
      case 'sports':
        addCategoryNews(data, sports, 'Sports');
        break;
      case 'technology':
        addCategoryNews(data, technology, 'Technology');
        break;
      case 'entertainment':
        addCategoryNews(data, entertainment, 'Entertainment');
        break;
      default:
        console.error("Error: Invalid category");
    }
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }
}

function openModal(article) {
  const viewsData = JSON.parse(localStorage.getItem('articleViews')) || {};
  const articleId = article.title;

  const currentViews = viewsData[articleId] || article.views || 0;
  const newViews = currentViews + 1;
  viewsData[articleId] = newViews;
  localStorage.setItem('articleViews', JSON.stringify(viewsData));

  modalTitle.innerHTML = `<h2>${article.title}</h2>`;
  modalImage.innerHTML = `<img src="${article.urlToImage}" alt="image" class="modal-img">`;
  modalDescription.innerHTML = `<p>${article.content}</p>`;
  const dateOn = article.date.split('T')[0];
  modalDate.innerHTML = `<p>${dateOn}</p>`;
  modalTime.innerHTML = `<p>Approximately reading time: ${(article.wordCount / 200).toFixed(0)} min</p>`;

  modalDescription.insertAdjacentHTML(
    'beforeend',
    `<p><i class="fa-solid fa-eye"></i> Views: ${newViews}</p>`
  );

  modal.style.display = 'block';

  updateMainPageViews(articleId, newViews);
}

function updateMainPageViews(articleId, newViews) {
  const allNewsCards = document.querySelectorAll('[data-article]');
  allNewsCards.forEach(card => {
    const articleData = JSON.parse(card.getAttribute('data-article'));
    if (articleData.title === articleId) {
      const viewsElement = card.querySelector('.views-icon p');
      if (viewsElement) {
        viewsElement.textContent = newViews;
      }
    }
  });
}

function addHeadline(data) {
  const viewsData = JSON.parse(localStorage.getItem('articleViews')) || {};
  const topHeadline = data.articles.reduce((maxArticle, currentArticle) => 
    currentArticle.views > maxArticle.views ? currentArticle : maxArticle,
    data.articles[0]
  );

  const views = viewsData[topHeadline.title] || topHeadline.views || 0;

  headlineImage.innerHTML = `<img src="${topHeadline.urlToImage || "default-image.jpg"}" class="main-headline-img-js" alt="image">`;
  headlineTitle.innerHTML = `<h2>${topHeadline.title || "No title available"}</h2>`;
  headlineDescription.innerHTML = `<p>${topHeadline.content || "No content available."}</p>
                                   <p class="views-icon"><i class="fa-solid fa-eye"></i> ${views}</p>`;

  headlineImage.addEventListener('click', () => openModal(topHeadline));
  headlineTitle.addEventListener('click', () => openModal(topHeadline));
  headlineDescription.addEventListener('click', () => openModal(topHeadline));
}

function addHeadlines(data) {
    let html = '';
  
    data.articles.slice(2).forEach((elem) => {
      const title = elem.title.length < 100 ? elem.title : elem.title.slice(0, 100) + "...";
      html += `
        <div class="news" data-article='${JSON.stringify(elem)}'>
          <div class="img">
            <img src="${elem.urlToImage}" alt="image">
          </div>
          <div class="text">
            <div class="title">
              <a href="${elem.url}" target="_blank"><p>${title}</p></a>
            </div>
          </div>
        </div>`;
});
  
    topHeadlines.innerHTML = html;
  
    const newsCards = topHeadlines.querySelectorAll('.news');
    newsCards.forEach((card) => {
      card.addEventListener('click', function () {
        const articleData = JSON.parse(card.getAttribute('data-article'));
        openModal(articleData);
      });
    });
  }

function addTopNews(data) {
  const viewsData = JSON.parse(localStorage.getItem('articleViews')) || {};
  const article = data.articles[1];
  const views = viewsData[article.title] || article.views || 0;

  topImage.innerHTML = `<img src="${article.urlToImage}" alt="image" class="big">`;
  topTitle.innerHTML = `<h2>${article.title}</h2>`;
  topDescription.innerHTML = `<p>${article.description}</p>
                              <p class="views-icon"><i class="fa-solid fa-eye"></i> ${views}</p>`;

  topImage.addEventListener('click', () => openModal(article));
  topTitle.addEventListener('click', () => openModal(article));
  topDescription.addEventListener('click', () => openModal(article));
}

function addCategoryNews(data, container, category) {
  const viewsData = JSON.parse(localStorage.getItem('articleViews')) || {};
  let html = '';

  const categoryArticles = data.articles.filter((elem) => elem.category === category);
  categoryArticles.forEach((elem) => {
    const title = elem.title.length < 100 ? elem.title : elem.title.slice(0, 100) + "...";
    const views = viewsData[elem.title] || elem.views || 0;
    html += `
      <div class="newsCard" data-article='${JSON.stringify(elem)}'>
        <div class="img">
          <img src="${elem.urlToImage}" alt="image">
        </div>
        <div class="text">
          <div class="title">
            <p>${title}</p>
          </div>
          <div class="views-icon">
            <i class="fa-solid fa-eye"></i>
            <p>${views}</p>
          </div>
        </div>
      </div>`;
  });

  container.innerHTML = html;

  const cards = container.querySelectorAll('.newsCard');
  cards.forEach(card => {
    card.addEventListener('click', function () {
      const articleData = JSON.parse(card.getAttribute('data-article'));
      openModal(articleData);

      card.setAttribute('data-article', JSON.stringify(articleData));
    });
  });
}

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none'; 
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchNews('general');
  fetchNews('health');
  fetchNews('science');
  fetchNews('sports');
  fetchNews('technology');
  fetchNews('entertainment');
});
