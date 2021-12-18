import { RouteInfo } from '../types';
import View from './view'; // view.ts는 export default 이기 때문에 브레이스 안의 값은 자기가 쓰고 싶은 이름을 사용하면 된다. 보통은 같은 이름을 사용한다.

export default class Router {
    routeTable: RouteInfo[];
    defaultRoute: RouteInfo | null; // null도 가능
  
    constructor() {
      // route메서드는 브라우저의 이벤트 시스템이 호출하는 것이기 때문에 
      // 호출이 되었을 때, this context는 router클래스의 this가 아니게 된다.
      // 그렇게 되면 route의 defaultRoute변수 등 접근할 수 없게 됨
      // 이러한 에러를 피하기 위해 bind(this)
      window.addEventListener('hashchange', this.route.bind(this));
  
      this.routeTable = [];
      this.defaultRoute = null;
    }
  
    setDefaultPage(page: View, params: RegExp | null = null): void {
      this.defaultRoute = {
        path: '', 
        page, 
        params,
      };
    }
  
    addRoutePath(path: string, page: View, params: RegExp | null = null): void {
      // key와 value가 같은 경우에는 생략이 가능하다
      // push({path: path, page: page})  // 생략 전
      this.routeTable.push({ path, page, params });
    }
  
    route() {
      const routePath: string = location.hash;
      
      if (routePath === '' && this.defaultRoute) {
        this.defaultRoute.page.render();
        return;
      }
  
      for(const routeInfo of this.routeTable) {
        if (routePath.indexOf(routeInfo.path) >= 0) {        
          if (routeInfo.params) {
            const parseParams = routePath.match(routeInfo.params);
  
            if (parseParams) {
              routeInfo.page.render.apply(null, [parseParams[1]]);
            }          
          } else {
            routeInfo.page.render();
          }       
          return;
        }  
      }
    }
  }