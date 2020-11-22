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

  getByName(name, other) {
    // const sampleRes = {
    //     email: true,
    //     address: true,
    //     password: true,
    //     phoneNumber: true,
    //     zip: true,
    //     ssn: false,
    //     birthday: true,
    //     hometown: false,
    //     currenttown: false,
    //     jobdetails: false,
    //     relationshipstatus: false,
    //     interests: false,
    //     political: false,
    //     religious: false,
    //     databreach_sources: [],
    //     surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo']
    // }
    // return sampleRes;
    return http.post('/emails', {
      name: name,
      other: other
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