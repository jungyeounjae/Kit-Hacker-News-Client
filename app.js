const container = document.getElementById('root');
// let ajax = new XMLHttpRequest(); 変数
const ajax = new XMLHttpRequest();  // const data
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
  currentPage: 1,
}

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push('<ul>');

  for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
      `);
  }　

  newsList.push('</ul>');
  newsList.push(`
  <div>
    <a href="#/page/${sotre.currentPage > 1 ? store.currentPage - 1 : 1}">前</a>
    <a href="#/page/${store.currentPage + 1}">次</a>
  </div>
  `);

  container.innerHTML = newsList.join('');
}

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">list</a>
    </div>
  `;
}

function router() {
  const routePath = location.hash;
  // hashが"#"の場合はemptyを返却する
  if (routePath === '') {
    newsFeed();
  } else if(routePath.indexOf('#/page/') >= 0){
    store.currentPage = Number(routePath.substring(7));
    newsFeed();    
  } else {
    newsDetail();
  }
}

window.addEventListener('hashchange', router);

router();