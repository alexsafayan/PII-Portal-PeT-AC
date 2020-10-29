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

}

export default new EmailDataService();