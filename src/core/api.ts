import { NewsFeed, NewsDetail} from '../types/';

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

export class Api {
    xhr: XMLHttpRequest;
    url: string;
  
    constructor(url: string) {
      this.xhr = new XMLHttpRequest();
      this.url = url;
    }

    /**
     * async awitを使ってコールバックのない非同期関数を作成
     * awaitを使う為には、その関数も非同期である必要があり、関数にasyncを宣言する。
     * @param callback async関数はpromiseをreturnする
     */
     async request<AjaxResponse>(): Promise<AjaxResponse> {
      const response = await fetch(this.url);
      return await response.json() as AjaxResponse;
    }

    /**
     * XHRequest
     * @param callback callback関数をパラメータとして受け取って、returnとして返す
     */
    getRequestWithXHR<AjaxResponse>(callback: (data: AjaxResponse) => void): void {
      // 同期コード
      this.xhr.open('GET', this.url);
      this.xhr.addEventListener('load', () => {
        callback(JSON.parse(this.xhr.response) as AjaxResponse);
      });
      this.xhr.send();
    }

    /**
     * fetch api 
     * @param callback callback関数をパラメータとして受け取って、returnとして返す
     */
     getRequestWithPromise<AjaxResponse>(callback: (data: AjaxResponse) => void): void {
      // fecth(A,B)  A - URL, B - options(default : GET method)
      // return promoise object - resolve
      // catch - reject
      fetch(this.url)
        .then(response => response.json()) // 응답을 json으로 파싱(비동기적으로)
        .then(callback)
        .catch(() => {
          console.log(" no data ");
        })
    }
  }
  
export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  /**
   * 非同期関数を呼び出す側も非同期であるべき
   * @param callback 
   * @returns 
   */
  async getData(): Promise<NewsFeed[]> {
    return this.request<NewsFeed[]>();
  }

  getDataWithXhr(callback: (data: NewsFeed[]) => void): void {
    return this.getRequestWithXHR<NewsFeed[]>(callback);
  }

  getDataWithPromise(callback: (data: NewsFeed[]) => void): void {
    return this.getRequestWithPromise<NewsFeed[]>(callback);
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  /**
   * 非同期関数を呼び出す側も非同期であるべき
   * @param callback 
   * @returns 
   */
  async getData(): Promise<NewsDetail[]> {
    return this.request<NewsDetail[]>();
  }

  getDataWithXhr(callback: (data: NewsDetail) => void): void {
    return this.getRequestWithXHR<NewsDetail>(callback);
  }

  getDataWithPromise(callback: (data: NewsDetail) => void): void {
    return this.getRequestWithPromise<NewsDetail>(callback);
  }
}
  