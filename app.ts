interface Store {
  feeds: NewsFeed[];
  currentPage: number;
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly points: number;
  readonly comments_count: number;
  read?: boolean;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store: Store = {
  currentPage: 1,
  feeds: [],
};

/**
 * targetClassがbaseClassesクラウをextendsする。(Minin)
 * 多重extendsが不可能なため、このようなMinin記法を利用して多重extednsが実装できる
 * @param targetClass 
 * @param baseClasses 
 */
// function applyApiMixins(targetClass: any, baseClasses: any[]): void {
//   baseClasses.forEach(baseClass => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
//       const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
      
//       if (descriptor) {
//         Object.defineProperty(targetClass.prototype, name, descriptor);
//       }            
//     });
//   });
// }

class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', this.url, false);
    ajax.send();

    return JSON.parse(ajax.response) as AjaxResponse;
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

/**
 * コード上ではMixinにてNewsFeedApiとApiの機能がinteractionされるまでは追い付けられないので、明示的にextendsしてあげないといけない。
 */
// interface NewsFeedApi extends Api {};
// interface NewsDetailApi extends Api {};

// applyApiMixins(NewsFeedApi, [Api]);
// applyApiMixins(NewsDetailApi, [Api]);

class View {
  templete: string;
  container: HTMLElement;
  htmlList: string[];

  constructor(containerId: string, templete: string) {
     const containerElement = document.getElementById(containerId);

    if(!containerElement) {
      throw '최상위 컨테이너가 없어 UI 를 진행하지 못함';
    }

    this.container = containerElement;
    this.templete = templete;
    this.htmlList = [];
  }

  updateView(html: string): void {
    this.container.innerHTML = html;
  }
  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }
  getHtml(): string { 
    return this.htmlList.join('');
  }

  setTemplateData(key: string, value: string): void {
    this.templete = this.templete.replace(`{{__${key}__}}`, value);
  }
}

class NewsFeedView extends View {
  api: NewsFeedApi;
  feeds: NewsFeed[];

  constructor(containerId: string) {
    let template: string = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL);
    this.feeds = store.feeds;
  
    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
    }

  }
 
  render(): void {
    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      const {id, title, comments_count, user, points, time_ago, read} = this.feeds[i];
      this.addHtml(`
        <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${id}">${title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${user}</div>
              <div><i class="fas fa-heart mr-1"></i>${points}</div>
              <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
            </div>  
          </div>
        </div>    
      `);
    }
    
    this.setTemplateData('news_feed', this.getHtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage + 1));

    updateView(template);
  }

  makeFeeds():  void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/ ${store.currentPage}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>${newsDetail.title}</h2>
          <div class="text-gray-400 h-20">
            ${newsDetail.content}
          </div>
  
          {{__comments__}}
  
        </div>
      </div>
    `;
    super(containerId, template);
  }

  render() {
    const id = location.hash.substr(7);
    const api = new NewsDetailApi();
    const newsDetail: NewsDetail = api.getData(CONTENT_URL.replace('@id', id));

    for(let i=0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
  
    this.setTemplateData('comments', this.makeComment(newsDetail.comments));
  }

  makeComment(comments: NewsComment[]): string {
  
    for(let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];
  
      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>      
      `);
  
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }
  
    return this.getHtml();
  }
}





function router(): void {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router);

router();
