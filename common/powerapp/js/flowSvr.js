/******************************************************************************
* Copyright (C) 2019 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/
/**
* @desc 流程模块自定义相关,该模块依赖于【pd.resource】
* @date 20190215
* @author 操行
*/
import {PdResource} from './pd.resource';
export const FlowBaseSvr = {
	/**
	 * 查询流程类型，如SW：收文，FW：发文，...
	 */
	queryFlowType() {
		return PdResource.service({
			data: {
				service: "QUERY_FLOW_TYPE"
			}
		});
	},
	
	/**
	 * 查询用户可以发起的流程
	 */
	queryCanStartFlow() {
		return PdResource.service({
			data: {
				service: "QUERY_CANSTART_FLOW"
			}
		});
	},
	
	/**
	 * 更新关注状态  流程任务关注或取消关注
	 * @workflowId:流程实例编号
	 * @sfgz:是否关注 true or flase
	 */
	updateAttention(workflowId,sfgz) {
		return PdResource.service({
			data: {
				service: "UPDATE_ATTENTION",
				workflowId: workflowId,
				sfgz:sfgz
			}
		});
	},
	
	/**
     * 查询所有任务
     * @pageNo:请求第几页数据
     * @searchKey：查询条件
     * @queryDate:查询日期之前数据
     * @isAttention:是否仅查询关注任务
     * @success(data),成功后返回的数据
     * @error(xhr，type，errorThrown)：请求失败回调。
     */
    queryAllTaskList(pageNo, searchKey, queryDate, isAttention) {
		return PdResource.service({
			data: {
				service: "QUERY_ALL_TASK_LIST",
				searchKey: searchKey ? searchKey : '',
				queryDate: typeof(queryDate)!="undefined" ? queryDate : '',
				isAttention: typeof(isAttention)!="undefined" ? isAttention : '',
				P_CURRENT: pageNo
			}
		});
    },
    
	/**
     * 查询待办任务
     * @pageNo:请求第几页数据
     * @searchKey：查询条件
     * @queryType:查询类型,当类型为空时，查所有待办任务
     * @success(data),成功后返回的数据
     * @error(xhr，type，errorThrown)：请求失败回调。
     */
    queryUnderwayTaskList(queryType, pageNo, searchKey) {
		return PdResource.service({
			data: {
				service: "QUERY_UNDERWAY_TASK_LIST",
				searchKey: searchKey ? searchKey : '',
				queryType: queryType,
				P_CURRENT: pageNo
			}
		});
    },
    
    /**
     * 查询已办任务
     * @pageNo:请求第几页数据
     * @searchKey：查询条件
     * @queryType:查询类型,当类型为空时，查所有待办任务
     * @success(data),成功后返回的数据
     * @error(xhr，type，errorThrown)：请求失败回调。
     */
    queryFinishTaskList(queryType, pageNo, searchKey) {
		return PdResource.service({
			data: {
				service: "QUERY_FINISH_TASK_LIST",
				searchKey: searchKey ? searchKey : '',
				queryType: queryType,
				P_CURRENT: pageNo
			}
		});
    },
    
    /**
     * 查询流程基本信息列表(固定流和自由流通用，统一调用该方法)
     * @pageNo:请求第几页数据
     * @searchKey：查询条件
     * @queryType:查询类型
     * @success(data),成功后返回的数据
     * @error(xhr，type，errorThrown)：请求失败回调。
     */
    queryFlowList(queryType, pageNo, searchKey, queryDate) {
		return PdResource.service({
			data: {
				service: "QUERY_FLOW_LIST",
				searchKey: searchKey ? searchKey : '',
				queryDate: typeof(queryDate)!="undefined" ? queryDate : '',
				queryType: queryType,
				P_CURRENT: pageNo
			}
		});
    },
    
    /**
     * 查询流程基本信息详情(固定流和自由流通用，统一调用该方法)
     * @queryType:查询类型
     * @xh:序号
     */
    queryFlowDetail(queryType, xh, success, error) {
		return PdResource.service({
			data: {
				service: "QUERY_FLOW_DETAIL",
				queryType: queryType,
				xh: xh
			}
		});
    },
	
	/**
	 * 根据业务序号加载流程相关信息及状态(如实例编号、流程类型编号、步骤信息、相关办理权限、关注状态、是否自由流程等)
	 * @businessId:业务主键
	 * @stepId:当前步骤编号 (允许空。当不为空时，说明是待办任务，返回信息会包含流程操作按钮权限信息等)
	 */
	loadFlowInfo(businessId,stepId) {
		return PdResource.service({
			data: {
				service: "LOAD_FLOW_INFO",
				businessId: businessId,
				stepId: typeof(stepId)!="undefined" && stepId != "undefined" ? stepId : ''
			}
		});
	},
	
	/*工作流－撤回*/
	workflowRevoke(stepId){
		return PdResource.service({
			data: {
				service: "WORKFLOW_REVOKE_ACTION",
				stepId: stepId
			}
		});
	}
}