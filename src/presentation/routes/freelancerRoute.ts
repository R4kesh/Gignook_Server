import express from "express"
import { freelancerController } from "../controller/freelancerController/freelancerController"
import { freelancerRepository } from "../../infrastructure/repository/freelancerRepository"
import { freelancerUseCase } from "../../application/usecase/freelancerUseCase"
import uploadMiddleWare from "../../middleware/FileUpload"
import { title } from "process"
const router=express.Router()

const repository=new freelancerRepository()
const usecase=new freelancerUseCase(repository)
const controller=new freelancerController(usecase)

router.post('/details',controller.kycDetails.bind(controller))
router.post('/uploadImage',controller.profileImageUpload.bind(controller))
router.post('/uploadFile/:id',uploadMiddleWare.array('files',2),controller.fileUpload.bind(controller))

router.get('/profile/:id',controller.profileData.bind(controller))
router.put('/profile/edit/:id',controller.profileUpdate.bind(controller))

router.post('/workImage/:id',controller.workImage.bind(controller))
router.get('/posts',controller.listPost.bind(controller))

router.post('/posts/:id/interest',controller.postInterest.bind(controller))
router.post('/posts/:id/save',controller.savePost.bind(controller))
router.get('/saved/posts/:id',controller.savedPost.bind(controller))
router.delete('/unsave/posts/:id/:postId',controller.unSavePost.bind(controller))

router.post('/postWork/:id',uploadMiddleWare.array('files',2),controller.postWork.bind(controller))
router.put('/postWorkDatas/:id/:postId',controller.postWorkDatas.bind(controller))

router.get('/workList/:userId',controller.workList.bind(controller))

router.get('/workDetails/:id',controller.workDetails.bind(controller))
router.get('/freelancerDetails/:id',controller.freelancerDetails.bind(controller))
router.get('/freelancerWorks/:id',controller.freelancerWorks.bind(controller))

router.get('/feedback/:id',controller.feedbackList.bind(controller))
router.get('/workFeedback/:id',controller.workFeedback.bind(controller))

router.get('/paymentHistory/:id',controller.paymentHistory.bind(controller))
router.get('/order-stats/:id',controller.orderCount.bind(controller))
router.get('/order_totals/:id',controller.graphTotal.bind(controller))
router.get('/orders/:id',controller.freelancerOrders.bind(controller))
router.put('/orders/status/:id',controller.orderStatus.bind(controller))

export default router


