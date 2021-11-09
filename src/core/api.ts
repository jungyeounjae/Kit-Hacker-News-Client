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
  
    getRequest<AjaxResponse>(): AjaxResponse {
      const ajax = new XMLHttpRequest();
      ajax.open('GET', this.url, false);
      ajax.send();
  
      return JSON.parse(ajax.response) as AjaxResponse;
    }
  }
  
export class NewsFeedApi extends Api {
    getData(): NewsFeed[] {
      return this.getRequest<NewsFeed[]>();
    }
  }

export class NewsDetailApi extends Api {
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
    }
  }
  