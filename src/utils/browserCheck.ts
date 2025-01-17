export const isIOSSafari = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isChromeOnIOS = userAgent.includes('crios'); // iOS Chrome의 user agent는 'crios'를 포함
    
    return isIOS && !isChromeOnIOS;
};
