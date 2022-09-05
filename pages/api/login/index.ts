/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:17:55
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 10:46:48
 * @Description: 请填写简介
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/runMiddleware'
import { connectDB } from "@utils/connectDB";
import { generateAccessToken } from '@utils/generateAccessToken'

/**
 * @openapi
 * /api/login:
 *   post:
 *     description: 管理员登录
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
 *             required:
 *               - adminName
 *               - adminPass
 *             example:
 *               adminName: tohsaka888
 *               adminPass: 123456
 *     responses:
 *       200:
 *         description: 返回是否登录成功,token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 canLogin: 
 *                   type: boolean
 *                 token:
 *                   type: string
 *         example:
 *           success: true
 *           canLogin: true
 *           token: xxxxxxxxxxxxxxxxxx
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
      const users = await db.collection('admin')

      const body: { username: string; password: string } = req.body

      const result: any = await users.findOne({ ...body })
      const token = generateAccessToken({ admin: result, id: (result && result._id) })

      res.status(200).json({ success: true, canLogin: result ? true : false, token })
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