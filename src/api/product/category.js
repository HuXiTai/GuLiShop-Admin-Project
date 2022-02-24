import myAxios from "@/utils/request";

export default {
  // GET /admin/product/getCategory1
  // getCategory1
  getCategory1() {
    return myAxios.get(`/admin/product/getCategory1`);
  },
  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id) {
    return myAxios.get(`/admin/product/getCategory2/${category1Id}`);
  },
  // GET /admin/product/getCategory3/{category2Id}
  // getCategory3
  getCategory3(category2Id) {
    return myAxios.get(`/admin/product/getCategory3/${category2Id}`);
  }
};
