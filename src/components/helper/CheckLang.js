export default function checkUserLanguage() {
  if(navigator){
    let lang = navigator.language || navigator.userLanguage;
    switch(lang){
      case 'ko-KR':
        return 'ko';
      case 'ko':
        return 'ko';
      default:
        return 'en';
    }
  }
  return 'en';
}