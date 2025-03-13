
export class Utility {

    constructor() {
        console.log('Utility constructor');
    }

    isPC() {
        const userAgent = navigator.userAgent;
        // 모바일 기기의 userAgent에 포함된 키워드 목록
        const mobileKeywords = ['Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
        // 모바일 키워드가 userAgent에 포함되지 않으면 PC로 간주
        return !mobileKeywords.some(keyword => userAgent.includes(keyword));
    }

}