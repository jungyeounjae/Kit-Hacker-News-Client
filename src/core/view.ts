export default abstract class View {
    private templete: string;
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];
  
    constructor(containerId: string, templete: string) {
       const containerElement = document.getElementById(containerId);
  
      if(!containerElement) {
        throw '최상위 컨테이너가 없어 UI 를 진행하지 못함';
      }
  
      this.container = containerElement;
      this.templete = templete;
      this.renderTemplate = templete
      this.htmlList = [];
    }
  
    protected updateView(): void {
      this.container.innerHTML = this.renderTemplate;
      this.renderTemplate = this.templete; // 元のtemplateにset
    }
  
    protected addHtml(htmlString: string): void {
      this.htmlList.push(htmlString);
    }
  
    protected getHtml(): string { 
      const snapshot = this.htmlList.join('');
      this.clearHtmlList();
      return snapshot;
    }
  
    private clearHtmlList(): void {
      this.htmlList = [];
    }
  
    setTemplateData(key: string, value: string): void {
      this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }
  
    // render 메서드 작성을 자식 클래스에게 강제시킨다.
    abstract render(): void;
  }