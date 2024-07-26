import express from "express"
import { userController } from "../controller/userController/userController";
import { userRepository } from "../../infrastructure/repository/userRepository";
import { userUseCase } from "../../application/usecase/userUseCase";
import authenticateUserJwt from "../../middleware/userAuth";
import uploadMiddleWare from "../../middleware/FileUpload";
const router=express.Router()

const repository=new userRepository()
const usecase=new userUseCase(repository)
const controller=new userController(usecase)

router.post('/signup',controller.signupPost.bind(controller))
router.get('/verify',controller.verifyEmail.bind(controller))
router.post('/login',controller.loginVerify.bind(controller))
router.post('/google',controller.googleSign.bind(controller))
router.post('/forgotpassword',controller.forgetPasswordSendEmail.bind(controller))
router.post('/verifyforgototp',controller.verifyForgetOtp.bind(controller))
router.post('/forgotresetpassword',controller.forgetResetPassword.bind(controller))
router.get('/allUser/:id',authenticateUserJwt,controller.notBlocked.bind(controller))
router.post('/switchfreelancer',authenticateUserJwt,controller.freelancerOrNot.bind(controller))
router.get('/listFreelancers',authenticateUserJwt,controller.listFreelancers.bind(controller))

router.post('/post/:id',controller.postUpload.bind(controller))
router.post('/postFile/:id',uploadMiddleWare.array('files',2),controller.postFile.bind(controller))
router.put('/postDatas/:id/:postId',controller.postDatas.bind(controller))

router.get('/listWorks',controller.listWorks.bind(controller))

router.post('/payment',controller.gigPayment.bind(controller))

router.post('/feedback',controller.feedback.bind(controller))

router.get('/postList/:id',controller.postList.bind(controller))

router.get('/paymentHistory/:id',controller.paymentHistory.bind(controller))
router.get('/name/:id',controller.findUser.bind(controller))


router.get('/conversations/:id',controller.conversation.bind(controller))
router.get('/users/:id',controller.users.bind(controller))
router.get('/message/:conversationId',controller.messageConversations.bind(controller))
router.post('/message',controller.message.bind(controller))
router.post('/addAttachentToChat',controller.addAttachment.bind(controller))

export default router;