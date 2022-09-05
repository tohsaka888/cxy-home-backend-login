/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:19:09
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 10:30:06
 * @Description: 请填写简介
 */

declare namespace Admin {

  type Permission = "管理员" | "活动" | "比赛"

  type Admin = {
    permissions: Permission[],
    adminName: string;
    adminPass: string;
  }
}