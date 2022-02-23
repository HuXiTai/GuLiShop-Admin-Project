import myAxios from "@/utils/request";

export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id, category2Id, category3Id) {
    return myAxios.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  deleteList(attrId) {
    return myAxios.delete(`/admin/product/deleteAttr/${attrId}`);
  },

  // POST /admin/product/saveAttrInfo
  // saveAttrInfo
  addOrUpdate(attr) {
    return myAxios.post(`/admin/product/saveAttrInfo`, attr);
  }
};
