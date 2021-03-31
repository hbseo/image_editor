export function getSearchImage (search, image_count) {
  var url = new URL("https://api.unsplash.com/photos/random");
  var params = {
    client_id: 'ua3Yx_zNDTdYyxlcX5JaO-KoZs4ri2-xZXZqc7_rcp0',
    count: image_count,
    query: search
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url, {
    method: 'get',
  })
  .then(res => res.json())
}