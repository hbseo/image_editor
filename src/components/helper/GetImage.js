export function getSearchImage (search, image_count) {
  var url = new URL("https://api.unsplash.com/photos/random");
  var params = {
    client_id: process.env.REACT_APP_UNSPLASH_PUBLIC_KEY,
    count: image_count,
    query: search
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url, {
    method: 'get',
  })
  .then(res => res.json())
}