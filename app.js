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

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  const id = location.hash.substring(1);

  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

/**
 * do hashing
 */
for(let i = 0; i < 10; i++) {
  const div = document.createElement('div');

  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `;

  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);