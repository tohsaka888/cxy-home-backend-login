/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:17:55
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 11:27:46
 * @Description: 请填写简介
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/runMiddleware'
import { connectDB } from "@utils/connectDB";

/**
 * @openapi
 * /api/admin/add:
 *   post:
 *     description: 新增管理员
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *                 description: 用户名
 *               adminPass:
 *                 type: string
 *                 description: 密码
 *               permissions:
 *                 type: string
 *                 description: 权限
 *     responses:
 *       200:
 *         description: 返回是否插入成功,token
 */

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    // Run the middleware
    await runMiddleware(req, res, cors)
    const db = await connectDB()

    if (db) {
      // select collection
      const admins = await db.collection('admin')

      const body: Admin.Admin = req.body

      const result = await admins.insertOne({ ...body })

      res.status(200).json({ success: true, isAdded: result.insertedId ? true : false })
    } else {
      new Error('数据库连接失败')
    }
  } catch (error: any) {
    res.status(200).send({
      success: false,
      error: (error as Error).message
    })
  }
}