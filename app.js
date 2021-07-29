const container = document.getElementById('root');
// let ajax = new XMLHttpRequest(); 変数
const ajax = new XMLHttpRequest();  // const data
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push('<ul>');

  for(let i = 0; i < 10; i++) {
    newsList.push(`
      <li>
        <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
      `);
  }　

  newsList.push('</ul>');

  container.innerHTML = newsList.join('');
}

function newsDetail() {
  const id = location.hash.substring(1);

  const newsContent = getData(CONTENT_URL.replace('@id', id));
  
  
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">list</a>
    </div>
  `;
}

window.addEventListener('hashchange', newsDetail);