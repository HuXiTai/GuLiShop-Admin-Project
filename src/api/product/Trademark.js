import myAxios from "@/utils/request";

export default {
  //根据品牌id删除某个品牌
  delete(id) {
    return myAxios({
      url: `/admin/product/baseTrademark/remove/${id}`,
      method: "delete"
    });
  },

  //根据品牌id是否存在选择添加还是修改：存在就是修改，反之就是添加
  addOrUpdate(trademark) {
    if (trademark.id) {
      //如果id存在证明是在修改
      return myAxios({
        url: "/admin/product/baseTrademark/update",
        method: "put",
        data: trademark
      });
    } else {
      //id不存在证明在添加
      return myAxios({
        url: "/admin/product/baseTrademark/save",
        method: "post",
        data: trademark
      });
    }
  },

  // 查询品牌的分页列表数据
  getPageList(page, limit) {
    return myAxios({
      url: `/admin/product/baseTrademark/${page}/${limit}`,
      method: "get"
    });
  }
};
