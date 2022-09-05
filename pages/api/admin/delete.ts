/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:17:55
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 11:46:54
 * @Description: 请填写简介
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/runMiddleware'
import { connectDB } from "@utils/connectDB";
import { generateAccessToken } from '@utils/generateAccessToken'
import { ObjectId } from 'mongodb';

/**
 * @openapi
 * /api/admin/delete:
 *   post:
 *     description: 删除
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: string
 *     responses:
 *       200:
 *         description: 返回是否删除
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

      const body: { ids: string[] } = req.body

      if (body.ids) {
        body.ids.forEach(async (id) => {
          await admins.deleteOne({
            _id: new ObjectId(id)
          })
        })
      }

      res.status(200).json({ success: true, isDeleted: true })
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