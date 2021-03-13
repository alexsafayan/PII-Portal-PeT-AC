import http from "../http-common";

class EmailDataService {
  getAll() {
    return http.get("/emails");
  }


  get(email) {
    return http.post('/emails', {
      email: email
    })
  }

  dummyGet(val) {
    return http.post('/emails', {
      val: val
    })
  }

  getData(name, zip) {
    return http.post('/name', {
      name: name,
      zip: zip
    })
  }

  getByName(name, other) {
    return http.post('/names', {
      name: name,
      zip: other
    })
  }

  searchSurfaceWeb(name, other) {
    return http.post('/crawl', {
      name: name,
      zip: other
    })
  }

  resolve(name, zip, surfaceWebResponse) {
    return http.post('/resolve', {
      name: name,
      zip: zip,
      surfaceWebResponse: surfaceWebResponse
    })
  }

  subscribeEmail(email)
  {
    return http.post('/subscribe',
    {
      email:email
    })
  }

}

export default new EmailDataService();