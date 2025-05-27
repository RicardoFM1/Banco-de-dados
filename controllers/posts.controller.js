
import { connection } from "../db.js"
import { createPostSchema } from "../schemas/post.schemas.js"


export const createPostController=async(req,res)=>{
    const bodyValues = Object.values(req.body)
    if(bodyValues.length < createPostSchema.length){
        return res.status(403).json({message:`Dados inválidos: os dados necessários são: ${createPostSchema}`})
    }
    const text = 'INSERT INTO post(name,content) values($1,$2) RETURNING *'
    const resPost = await connection.query(text,bodyValues)
    const createPost = resPost.rows[0]
    const text2 = 'INSERT INTO post_usuarios(user_id,post_id) values($1, $2)'
    const values = [req.user.id, createPost.id]
    await connection.query(text2,values)

    return res.status(201).json({...createPost,user_id:req.user.id})
}
export const getAllPostsController=async(req,res)=>{
   
    const text = `SELECT 
        c.id, u.user_id , c."content" , c."name" 
        FROM post_usuarios u
        JOIN post c
        ON u.post_id  = c.id;`    
    const resDb = await connection.query(text)

    return res.status(200).json(resDb.rows)
}
export const getPostByUserIdController=async(req,res)=>{
    const userId = parseInt(req.params.id)
    const text = `SELECT 
            c.id , u.user_id , c."content" , c."name" 
            FROM post_usuarios u
            JOIN post c
            ON u.post_id   = c.id
            where u.user_id = $1;`
    const values= [userId]
    const resDb = await connection.query(text,values)

    return res.status(200).json(resDb.rows)
}
export const patchPostByIdController = async(req,res)=>{
    const text = `SELECT * from post where id = $1`
    const values = [req.params.id]
    const query = await connection.query(text, values)

    return res.status(200).json(query.rows)
}