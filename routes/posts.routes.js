import {Router} from "express"
import { validateTokenMiddleware } from "../middleware/validateToken.middleware.js"
import { createPostController, getAllPostsController, getPostByUserIdController } from "../controllers/posts.controller.js"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import { createPostSchema } from "../schemas/post.schemas.js"
import { getUserByIdMiddleware } from "../middleware/getUserById.middleware.js"
import {patchPostByIdController} from "../controllers/posts.controller.js"

export const postRoutes = Router()

// create table post_usuarios (id serial primary key, user_id int, post_id int,
// 	constraint fk_user foreign key(user_id) references usuarios(id),
// 	constraint fk_post foreign key(post_id) references post(id)
// );

postRoutes.post("",validateDataMiddleware(createPostSchema), validateTokenMiddleware,createPostController)
postRoutes.get("",getAllPostsController)
postRoutes.get("/:id",getUserByIdMiddleware, getPostByUserIdController)
postRoutes.patch("/:id", validateTokenMiddleware, patchPostByIdController)

// fazer uma rota de patch e delete na qual só permita mudar se for o dono da conta, verificando o id do post e o 
// id da requisição do usuário.