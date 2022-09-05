/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:17:55
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 11:18:09
 * @Description: 请填写简介
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/runMiddleware'
import { connectDB } from "@utils/connectDB";

/**
 * @openapi
 * /api/admin/list:
 *   post:
 *     description: 管理员列表
 *     responses:
 *       200:
 *         description: 列表
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
      const result = await admins.find({}).toArray()

      res.status(200).json({ success: true, list: result })
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