import http from "../http-common";

class EmailDataService {
  getByEmail(email) {
    return http.post('/emails', {
      email: email
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

  searchSurfaceWebEmail(email, dbResponse) {
    return http.post('/crawlEmail', {
      email: email,
      dbResponse: dbResponse
    })
  }

  resolve(name, zip, surfaceWebResponse) {
    return http.post('/resolve', {
      name: name,
      zip: zip,
      surfaceWebResponse: surfaceWebResponse
    })
  }

  resolveEmail(dbResponse, surfaceWebResponse) {
    return http.post('/resolveEmail', {
      dbResponse: dbResponse,
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