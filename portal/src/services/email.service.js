import http from "../http-common";

class EmailDataService {
  //search #1 in email db search
  getByEmail(email) {
    return http.post('/emails', {
      email: email
    })
  }

  //search #2 for email
  //calls surface web email crawler api
  searchSurfaceWebEmail(email, dbResponse) {
    return http.post('/crawlEmail', {
      email: email,
      dbResponse: dbResponse
    })
  }

  //search #1 in name+zip db search
  getByName(name, other) {
    return http.post('/names', {
      name: name,
      zip: other
    })
  }

  //search #2 in name+zip db search
  //calls surface web crawlers api
  searchSurfaceWeb(name, other) {
    return http.post('/crawl', {
      name: name,
      zip: other
    })
  }

  //search #3 in name+zip db search
  //calls api to resolve surface and dark web results
  resolve(dbResponse, surfaceWebResponse) {
    return http.post('/resolve', {
      dbResponse: dbResponse,
      surfaceWebResponse: surfaceWebResponse
    })
  }

  //not used right now
  //we dont resolve entities on email searches
  resolveEmail(name, zip, surfaceWebResponse) {
    return http.post('/resolveEmail', {
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