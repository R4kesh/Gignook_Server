import express from "express"
// import {adminController} from "../controller/adminController/adminController"
import { adminController } from "../controller/adminController/adminController"
import { adminRepository } from "../../infrastructure/repository/adminRepository"
import { adminUseCase } from "../../application/usecase/adminUseCase"
import { authenticateAdminJwt } from "../../middleware/adminAuth"
const router=express.Router()

const repository=new adminRepository()
const usecase=new adminUseCase(repository)
const controller=new adminController(usecase)

router.post('/login',controller.login.bind(controller))

router.get('/users',authenticateAdminJwt,controller.userList.bind(controller))
router.put('/users/:userId/:action',authenticateAdminJwt,controller.usersAction.bind(controller))

router.get('/freelancer',authenticateAdminJwt,controller.freelancerList.bind(controller))
router.get('/freelancer/details/:freelancerId',authenticateAdminJwt,controller.freelancerDetails.bind(controller))

router.post('/freelancer/approve/:id',authenticateAdminJwt,controller.freelancerApproval.bind(controller))
router.post('/freelancer/reject/:id',authenticateAdminJwt,controller.freelancerReject.bind(controller))

router.get('/freelancers',authenticateAdminJwt,controller.freelancersList.bind(controller))
router.put('/freelancers/:userId/:action',authenticateAdminJwt,controller.freelancersAction.bind(controller))

router.get('/posts',authenticateAdminJwt,controller.postList.bind(controller))
router.put('/posts/:postid/:action',authenticateAdminJwt,controller.postListUnlist.bind(controller))

router.get('/payments',authenticateAdminJwt,controller.paymentList.bind(controller))

router.get('/count_display',controller.countDocument.bind(controller))
router.get('/payment_totals',controller.totalPayments.bind(controller))

export default router