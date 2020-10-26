import http from "../http-common";

class EmailDataService {
  getAll() {
    return http.get("/emails");
  }

  get(id=id) {
    return http.get(`/emails/${id}`);
  }

}

export default new EmailDataService();