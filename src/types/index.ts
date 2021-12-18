import View from '../core/view';
// 인터페이스는 타입 체크를 위해 사용되며 변수 함수 클래스에 사용 가능
// 여러가지 타입을 갖는 프로퍼티로 이루어진 새로운 타입을 정의하는 것과 같다


export interface NewsStore {
    getAllFeeds: () => NewsFeed[];
    getFeed: (position: number) => NewsFeed;
    setFeeds: (feeds: NewsFeed[]) => void;
    makeRead: (id: number) => void;
    hasFeeds: boolean;
    currentPage: number;
    numberOfFeed: number;
    nextPage: number;
    prevPage: number;   
}
  
export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}
  
export interface NewsFeed extends News {
    readonly points: number;
    readonly comments_count: number;
    read?: boolean;
}
  
export interface NewsDetail extends News {
    readonly comments: NewsComment[];
}
  
export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}
  
export interface RouteInfo {
    path: string;
    page: View;
    params: RegExp | null;
}