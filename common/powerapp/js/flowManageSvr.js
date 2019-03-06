/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 发起流程流程、结束等业务办理请求的服务,该模块依赖于【pd.resource】
* @date 20190128
* @author 操行
*/
import {PdResource} from './pd.resource';
export const FlowManageSvr = {
	
	/**
	 * 查询流程用户
	 * @freeflowId:自由流加载流程定义人员所需参数(如果freeflowId为空，不会查询流程定义人员信息)
	 * @stepId:步骤编号，工作流加载流程定义人员所需参数
	 * @stepDefId:步骤定义编号，工作流加载流程定义人员所需参数
	 * 如果freeflowId或(stepId与stepDefId)为空时，只加载显示部门人员和自定义用户组)
	 */
	queryUsers(freeflowId,stepId,stepDefId,isQueryZzjg){
		return PdResource.service({
			data: {
				service: "QUEYR_USERS",
				freeflowId: typeof(freeflowId)!="undefined" ? freeflowId : '',
				stepId: typeof(stepId)!="undefined" ? stepId : '',
				stepDefId: typeof(stepDefId)!="undefined" ? stepDefId : '',
				isQueryZzjg: typeof(isQueryZzjg)!="undefined" ? isQueryZzjg : '' ,
			}
		});
	},
	
	/**
	 * 保存快捷常用语
	 * @flowDefId:流程定义ID
	 */
	kjyjManage(flowDefId,dm,dmnr,opType) {
		return PdResource.service({
			data: {
				service: "KJYJ_MANAGE",
				flowDefId: typeof(flowDefId)!="undefined" ? flowDefId : '',
				dm: typeof(dm)!="undefined" ? dm : '',
				dmnr: typeof(dmnr)!="undefined" ? dmnr : '',
				opType: typeof(opType)!="undefined" ? opType : ''
			}
		});
	},
	
	/*==============freeflow 自由流程  相关服务===============*/
	/**
	 * 加载自由流流转前信息(自由流操作统一预处理接口),如：签字信息、意见类型、快捷常用语 等
	 * @stepId:步骤编号
	 * @opType:操作类型，按操作类型分别加载不同的信息 (TRANSITION:流转；SENDBACK：退回,FINISH：结束)
	 */
	loadFreeflowProBeforeInfo(stepId,opType) {
		return PdResource.service({
			data: {
				service: "LOAD_FREEFLOW_PROCESS_BEFORE_INFO",
				stepId: stepId,
				opType: opType
			}
		});
	},
	
	/*自由流-流转*/
	freeTransition(data){
		return PdResource.service({
			data: {
				service: "FREEFLOW_TRANSITION_ACTION",
				stepId: data.stepId,
				nextProcessors: data.nextProcessors,
				copyReaderUsers: data.copyReaderUsers,
				signature: data.signature,
				opinionType: data.opinionType,
				opinion: data.opinion
			}
		});
	},
	
	/*自由流-退回*/
	freeSendBack(data){
		return PdResource.service({
			data: {
				service: "FREEFLOW_SENDBACK_ACTION",
				stepId: data.stepId,
				nextProcessors: data.nextProcessors
			}
		});
	},
	
	/*自由流-结束*/
	freeFinish(data){
		return PdResource.service({
			data: {
				service: "FREEFLOW_FINISH_ACTION",
				stepId: data.stepId,
				processor: data.processor,
				signature: data.signature,
				opinionType: data.opinionType,
				opinion: data.opinion
			}
		});
	},
	
	/*==============workflow 固定工作流程  相关服务===============*/
	/*-----------工作流预处理接口(常用操作类、会签类、会办类)-----------*/
	/**
	 * 加载工作流处理前信息(统一预处理接口)
	 * @stepId:步骤编号
	 * @opType:操作类型，按操作类型分别加载不同的信息 
	 * (TRANSITION:流转；SENDBACK：退回；FINISH：结束；SINGLEFINISH：完毕；COUNTERSIGN：会签；FEEDBACK：返回；ENDORSE：加签，...)
	 * @返回信息,如：签字信息、意见类型、快捷常用语 等
	 */
	loadWorkflowProBeforeInfo(stepId,opType) {
		return PdResource.service({
			data: {
				service: "LOAD_WORKFLOW_PROCESS_BEFORE_INFO",
				stepId: stepId,
				opType: opType
			}
		});
	},
	
	/*-----------工作流流程操作接口-----------*/
	/*工作流-流转*/
	workflowTransition(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_TRANSITION_ACTION",
				stepId: data.stepId,
				selectSteps: data.selectSteps,
				selectUsers: data.selectUsers,
				selectHelpers: typeof(data.selectHelpers)!="undefined" ? data.selectHelpers : '',
				selectReaders: typeof(data.selectReaders)!="undefined" ? data.selectReaders : '',
				signature: typeof(data.signature)!="undefined" ? data.signature : '',
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				sendMsg: typeof(data.sendMsg)!="undefined" ? data.sendMsg : ''
			}
		});
	},
	
	/*工作流-转办*/
	workflowTurnDeal(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_TURN_DEAL_ACTION",
				stepId: data.stepId,
				selectUsers: data.selectUsers,
				opinion: data.opinion
			}
		});
	},
	
	/*工作流-完毕*/
	workflowSingleFinish(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_SINGLEFINISH_ACTION",
				stepId: data.stepId,
				opinion: data.opinion,
				opinionType: data.opinionType
			}
		});
	},
	
	/*工作流-已阅*/
	workflowReader(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_READER_ACTION",
				stepId: data.stepId,
				opinion: data.opinion
			}
		});
	},
	
	/*工作流-结束*/
	workflowFinish(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_FINISH_ACTION",
				stepId: data.stepId,
				opinion: data.opinion,
				opinionType: data.opinionType,
				signature: data.signature
			}
		});
	},
	
	/*工作流-退回*/
	workflowSendBack(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_SENDBACK_ACTION",
				stepId: data.stepId,
				backStepIds:data.backStepIds,
				backProcesser:data.selectUsers,
				opinion: data.opinion
			}
		});
	},
	
	/*工作流-抄送*/
	workflowCopyReader(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_COPYREADAR_ACTION",
				stepId: data.stepId,
				copyReaderUsers: data.copyReaderUsers,
				opinion: data.opinion
			}
		});
	},

	/*工作流－会签（发起）*/
	workflowCounterSign(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_COUNTERSIGN_ACTION",
				stepId: data.stepId,
				selectSteps: data.selectSteps,
				selectUsers: data.selectUsers,
				type: data.type,
				status: data.status,
				activePoint: data.activePoint,
				opinionProcessor: data.opinionProcessor,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				signature: typeof(data.signature)!="undefined" ? data.signature : '',
				sendMsg: typeof(data.sendMsg)!="undefined" ? data.sendMsg : ''
			}
		});
	},
	
	/*工作流－会签返回*/
	workflowFeedBack(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_FEEDBACK_ACTION",
				stepId: data.stepId,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				countersignOpinion: typeof(data.countersignOpinion)!="undefined" ? data.countersignOpinion : '',
				isUpdate: typeof(data.isUpdate)!="undefined" ? data.isUpdate : false
			}
		});
	},
	
	/*工作流－会签加签*/
	workflowEndorse(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_ENDORSE_ACTION",
				stepId: data.stepId,
				selectUsers: data.selectUsers,
				selectReaders: data.selectReaders,
				status: data.status,
				activePoint: data.activePoint,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				signature: typeof(data.signature)!="undefined" ? data.signature : '',
				sendMsg: typeof(data.sendMsg)!="undefined" ? data.sendMsg : ''
			}
		});
	},
	
	/*工作流－会办（发起）*/
	workflowJointProcess(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_JOINT_PROCESS_ACTION",
				stepId: data.stepId,
				selectSteps: data.selectSteps,
				selectUsers: data.selectUsers,
				selectHelpers: data.selectHelpers,
				selectReaders: data.selectReaders,
				isCollect: data.isCollect,
				opinionProcessor: data.opinionProcessor,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				signature: typeof(data.signature)!="undefined" ? data.signature : '',
				sendMsg: typeof(data.sendMsg)!="undefined" ? data.sendMsg : ''
			}
		});
	},
	
	/*工作流－会办返回*/
	workflowJointProcessFeedBack(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_JOINT_PROCESS_FEEDBACK_ACTION",
				stepId: data.stepId,
				feedbackUserId: data.feedbackUserId,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : ''
			}
		});
	},
	
	/*工作流－会办交办*/
	workflowJointProcessTransition(data){
		return PdResource.service({
			data: {
				service: "WORKFLOW_JOINT_PROCESS_TRANSITION_ACTION",
				stepId: data.stepId,
				selectUsers: data.selectUsers,
				selectHelpers: data.selectHelpers,
				selectReaders: data.selectReaders,
				opinion: typeof(data.opinion)!="undefined" ? data.opinion : '',
				opinionType: typeof(data.opinionType)!="undefined" ? data.opinionType : '',
				signature: typeof(data.signature)!="undefined" ? data.signature : '',
				sendMsg: typeof(data.sendMsg)!="undefined" ? data.sendMsg : '',
			}
		});
	}
};
