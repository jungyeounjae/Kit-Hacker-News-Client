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

  getDataWithXhr(callback: (data: NewsDetail) => void): void {
    return this.getRequestWithXHR<NewsDetail>(callback);
  }

  getDataWithPromise(callback: (data: NewsDetail) => void): void {
    return this.getRequestWithPromise<NewsDetail>(callback);
  }
}
  