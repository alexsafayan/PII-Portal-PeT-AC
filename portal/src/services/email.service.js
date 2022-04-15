import http from "../http-common";

class EmailDataService {
  //search #1 in email db search
  queryEmail(email) {
    return http.post('/emails', {
      email: email
    })
  }

  //search #2 for email
  //calls surface web email crawler api
  crawlPSEEmail(email, dbResponse) {
    return http.post('/crawlEmail', {
      email: email,
      dbResponse: dbResponse
    })
  }

  //search #1 in name+zip db search
  queryName(name, other) {
    return http.post('/names', {
      name: name,
      zip: other
    })
  }

  //search #2 in name+zip db search
  //calls surface web crawlers api
  crawlPSE(name, other, search_engine, surfaceWebResults, surfaceWebResponse_clean, surfaceWebAttributesLists) {
    return http.post('/crawl', {
      name: name,
      zip: other,
      search_engine: search_engine,
      surfaceWebResponse: surfaceWebResults,
      cleanResponses: surfaceWebResponse_clean,
      surfaceWebAttributesLists: surfaceWebAttributesLists
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