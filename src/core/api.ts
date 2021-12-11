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
    ajax: XMLHttpRequest;
    url: string;
  
    constructor(url: string) {
      this.ajax = new XMLHttpRequest();
      this.url = url;
    }
  
    /**
     * 
     * @param callback callback関数をパラメータとして受け取って、returnとして返す
     */
    getRequest<AjaxResponse>(callback: (data: AjaxResponse) => void): void {
      const ajax = new XMLHttpRequest();
      // 同期コード
      ajax.open('GET', this.url);
      this.ajax.addEventListener('load', () => {
        callback(JSON.parse(this.ajax.response) as AjaxResponse);
      });
      ajax.send();
    }
  }
  
export class NewsFeedApi extends Api {
    getData(callback: (data: NewsFeed[]) => void): void {
      return this.getRequest<NewsFeed[]>(callback);
    }
}

export class NewsDetailApi extends Api {
  getData(callback: (data: NewsDetail) => void): void {
    return this.getRequest<NewsDetail>(callback);
  }
}
  