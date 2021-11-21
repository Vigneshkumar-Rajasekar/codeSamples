
var ajaxURL 			= "DashboardServlet";
var TOT_QTY_PREFIX		= "TOTAL QTY";
var selectDataFrom 		= 0;
var selectDataTo 		= 0;
var maxPodsPerPage 		= 0;
var defMaxRows			= 2;
var defMaxColsPerRow	= 6;
var MAX_ROWS 			= 0;
var MAX_COLS 			= 0;
var PARTITION_COL 		= 0;
var startRow			= 0;
var endRow				= 0;
var dataCntForStage		= 0;
var prevStageGrpId		= "";
var doAutoRefresh		= false;
var MAX_DEF_DESIGN_PODS	= 6;

var DEF_POD_WIDTH		= 200;
var DEF_POD_HEIGHT		= 200;
var REV_POD_WIDTH		= 150;
var REV_POD_HEIGHT		= 200;
var DEF_POD_WIDTH_PX	= "200px";
var DEF_POD_HEIGHT_PX	= "200px";
var REV_POD_WIDTH_PX	= "150px";
var REV_POD_HEIGHT_PX	= "200px";

function onChangeStageGrpId()
{
	triggerAjaxCall(false,true);
}


function loadDashboardPod()
{
	triggerAjaxCall(false,false);
}


function setDataCountAgainstStageGrpId()
{
	try
	{
		var parameters = new Object();
		
		parameters["isAjaxCall"] 		= "Y";
		parameters["hStageGrpId"] 		= $("#cmbStgGrpId").val();
		parameters["hAjaxCallFor"] 		= "GET_DATA_COUNT";
		
		$.ajax
	 	({
	 		url 		: ajaxURL,
		 	type 		: "POST",
		 	async		: false,
		 	dataType	: "json",
		 	data		: parameters,
		 	success		: function(data)
			{
		 		if(data != null)
		 		{
		 			dataCntForStage = parseInt(data.DATA_COUNT);
		 		}
			},
		 	error : function(data)
			{
		 		//alert("Error in getting response.");
			}
	 	});
	}
	catch(e)
	{
		alert(e);
	}
}

function triggerAjaxCall(autoRefresh,stgLaneChange)
{
	var stageLaneId = $("#cmbStgGrpId").val();
	
	setDataCountAgainstStageGrpId();
	/* if(stageLaneId != prevStageGrpId)
	{
		setDataCountAgainstStageGrpId();
		prevStageGrpId = stageLaneId;
	} */
	
	try
	{
		var parameters = new Object();
		
		parameters["isAjaxCall"] 		= "Y";
		parameters["MAX_ROWS"] 			= document.frmConsolidationDashboard.hMaxRow.value;
		parameters["MAX_COLS_PER_ROW"] 	= document.frmConsolidationDashboard.hMaxColPerRow.value;
		parameters["hStageGrpId"] 		= stageLaneId;
		parameters["hStartRow"] 		= startRow;
		parameters["hEndRow"] 			= endRow;
		parameters["hAjaxCallFor"] 		= "GET_DASHBOARD_DATA";
		if(stgLaneChange){
			parameters["hStageLaneChange"] 	= YES;			
		}
		
		$.ajax
	 	({
	 		url 		: ajaxURL,
		 	type 		: "POST",
		 	async		: false,
		 	dataType	: "json",
		 	data		: parameters,
		 	success		: function(data)
			{
		 		if(data != null)
		 		{
		 			$("#execTime").html(data.EXECUTED_TIME);
		 			var gridData 		= data.DATA_ARRAY;
		 			
		 			if(gridData != null && gridData.length > 0)
	 				{
		 				if(stgLaneChange)
	 					{
		 					//stopAutoRefresh();
		 					document.frmConsolidationDashboard.hMaxRow.value 			= data.MAX_ROWS;
				 			document.frmConsolidationDashboard.hMaxColPerRow.value 		= data.MAX_COLS;
				 			document.frmConsolidationDashboard.hPartitionColumn.value 	= data.PARTITION_COL;
				 			setMaxPodsPerPage();
				 			setStartEndRows();
	 					}
			 			
		 				constructDashboard(gridData);
		 				setNavigationProperties();
		 				setCSSProp();
	 				}
		 			else
	 				{
		 				$("#laneMainTbl").html('');
	 				}
		 		}
			},
		 	error : function(data)
			{
		 		alert("Error in getting response.");
		 		stopAutoRefresh();
			}
	 	});
	}
	catch(e)
	{
		alert(e);
	}
	
	if(autoRefresh)
	{
		autoRefreshData();	
	}
}

function constructDashboard(gridData)
{
	var gridBuilder		= "";
	if(gridData != null && gridData.length > 0)
	{
		var rowData;
		var partStage 	= "";
		var stageLaneId = "";
		var ordGroupId 	= "";
		var totCarton 	= "";
		var stgCarton 	= "";
		var stgQty 		= "";
		var ordQty 		= "";
		var carrCd 		= "";
		var dataCounter	= 0;
		
		var mainDiv 		= "";
		var stageLaneDiv 	= "";
		var totalQty		= "";
		var divCss			= "";
		var showPartStage 	= "";
		var rowArray		= new Array();
		var mainColArray	= new Array();
		var stageColArray	= new Array();
		var canAddPartition = true;
		
		var podWidth 		= DEF_POD_WIDTH_PX;
		var podHeight 		= DEF_POD_HEIGHT_PX;
		var partStgHeight 	= "100px";
		var podPartHeight 	= "32px";
		var podCarrCdHeight = "32px";
		
		if(MAX_COLS > MAX_DEF_DESIGN_PODS)
		{
			podWidth 		= REV_POD_WIDTH_PX;
			podHeight 		= REV_POD_HEIGHT_PX;
			partStgHeight 	= "70px";
			podPartHeight 	= "22px";
			podCarrCdHeight = "62px";
		}

		for(var cnt = 0; cnt < gridData.length; cnt++)
		{
			rowData = gridData[cnt];
			mainDiv 		= "";
			stageLaneDiv 	= "";
			totalQty 		= "";
			showPartStage 	= "";
			
			if(rowData != null)
			{
				dataCounter++;
				partStage 	= rowData.PART_STAGE;
				stageLaneId = rowData.STAGE_LANE_ID;
				ordGroupId 	= rowData.ORD_GROUP_NO;
				//totCarton 	= rowData.TOT_CARTON;
				stgCarton 	= rowData.STAGE_CARTON;
				stgQty 		= rowData.STAGE_QTY;
				ordQty 		= rowData.ORDER_QTY;
				carrCd 		= rowData.CARR_CD;
				
				if(trim(stgCarton) != "" || trim(stgQty) != ""){
					totalQty = stgQty + "(" + stgCarton + ") of " + ordQty;  
				}
				
				if(trim(ordGroupId) != ""){
					showPartStage = partStage;
				}
				
				//divCss = getDivCss(stgCarton,totCarton);
				divCss = getDivCss(stgQty,ordQty);
				
				

				mainDiv += "<TD style=\"padding-left: 5px; padding-top: 20px;\">"; 
					mainDiv += "<DIV class = \"modal-content "+divCss+"\" style = \"height: "+podHeight+"; width: "+podWidth+"; \" align = \"left\" >";
						mainDiv += "<TABLE width = \"100%\">";
							mainDiv += "<TR> <TD align=\"center\" style=\"height: "+podPartHeight+"; font-size: 18px;\">"+blankChkHTMLValue(ordGroupId)+"</TD> </TR>";
							mainDiv += "<TR style=\"height : 2px;\"> <TD><HR></TD> </TR>";
							mainDiv += "<TR> <TD align=\"center\" style=\"height: "+partStgHeight+"; font-size: 60px; font-weight : 600;\">"+blankChkHTMLValue(showPartStage)+"</TD> </TR>";
							mainDiv += "<TR style=\"height : 2px;\"> <TD><HR></TD> </TR>";
							mainDiv += "<TR> <TD align=\"center\" style=\"height: "+podCarrCdHeight+"; font-size: 14px; font-weight: 600;\">"+blankChkHTMLValue(carrCd)+"</TD> </TR>";
							mainDiv += "<TR style=\"height : 2px;\"> <TD><HR></TD> </TR>";
							mainDiv += "<TR> <TD align=\"center\" style=\"height: 25px; font-size: 23px; font-weight: 600\">"+blankChkHTMLValue(totalQty)+"</TD> </TR>";
						mainDiv += "</TABLE>";
					mainDiv += "</DIV>";
				mainDiv += "</TD>";
			
			
				// Show: X(S) of T where X: Number of Picked and staged quantities for the order. T: Total Quantities for the order. S: is the total number of SCNs created so far and staged.
			
				stageLaneDiv += "<TD style=\"padding-left: 5px;\">"; 
					stageLaneDiv += "<DIV class = \"modal-content podCssCtnr\" style = \"width: "+podWidth+"; \" align = \"left\" >";
						stageLaneDiv += "<TABLE align = \"center\" border = \"0\">";
							stageLaneDiv += "<TR>";
								stageLaneDiv += "<TD align=\"center\" style=\" padding-top : 4px; font-weight: 600; color : white;\">"+blankChkHTMLValue(stageLaneId)+"</TD>";
							stageLaneDiv += "</TR>";
						stageLaneDiv += "</TABLE>";
					stageLaneDiv += "</DIV>";
				stageLaneDiv += "</TD>";
				
				
				if( (dataCounter == PARTITION_COL) && canAddPartition)
				{
					mainDiv += "<TD id = \"partitionTDId\" rowspan = \"~PARTITIONROWSPAN~\" style=\"padding-left: 5px; padding-top: 20px;\">"; 
						mainDiv += "<DIV id = \"partitionDivId\" class = \"modal-content partitionCss\" style = \"height : ~PARTITIONHEIGHT~ ;\" align = \"left\" >";
						mainDiv += "</DIV>";
					mainDiv += "</TD>";
					
					stageLaneDiv += "";
					canAddPartition = false;
				}
				
				
				mainColArray.push(mainDiv);
				stageColArray.push(stageLaneDiv);
				
				if(dataCounter == MAX_COLS || cnt == (gridData.length - 1))
				{
					rowArray.push(mainColArray);
					rowArray.push(stageColArray);
					
					mainColArray	= new Array();
					stageColArray	= new Array();
					dataCounter = 0;
				}
			}
		}


		if(rowArray != null && rowArray.length > 0)
		{
			var colArray;
			for(var rowCnt = 0; rowCnt < rowArray.length; rowCnt++)
			{
				colArray = rowArray[rowCnt];
				if(colArray != null && colArray.length > 0)
				{
					gridBuilder += "<TR>";
					for(var colCnt = 0; colCnt < colArray.length; colCnt++)
					{
						gridBuilder += colArray[colCnt];
					}
					gridBuilder += "</TR>";
				}
			}
		}
	}
	
	$("#sliderDiv").hide('slide', {direction: 'left'}, 1);
	
	
	
	if(gridBuilder != ""){
		$("#laneMainTbl").html(gridBuilder);
	} else {
		$("#laneMainTbl").html('');
	}
	
	$("#sliderDiv").show('slide', {direction: 'left'}, 400);
}

function setMaxPodsPerPage()
{
	var maxRow 	= trim(document.frmConsolidationDashboard.hMaxRow.value);
	var maxCol 	= trim(document.frmConsolidationDashboard.hMaxColPerRow.value);
	var partCol = trim(document.frmConsolidationDashboard.hPartitionColumn.value);
	
	try
	{
		if(maxRow != "" && maxCol != ""){
			maxPodsPerPage = (parseInt(maxRow) * parseInt(maxCol));
			MAX_ROWS = parseInt(maxRow);
			MAX_COLS = parseInt(maxCol);
		} else {
			maxPodsPerPage = (defMaxRows * defMaxColsPerRow);
			MAX_ROWS = defMaxRows;
			MAX_COLS = defMaxColsPerRow;
		}
		
		if(trim(partCol) != ""){
			PARTITION_COL = parseInt(partCol);	
		} else {
			PARTITION_COL 	= 0;
		}
	}
	catch(e)
	{
		maxPodsPerPage = (defMaxRows * defMaxColsPerRow);
		MAX_ROWS = defMaxRows;
		MAX_COLS = defMaxColsPerRow;
	}
}

function setNextStartRow()
{
	
}

function setNextEndRow()
{
	
}

function setStartEndRows()
{
	startRow 	= 1;
	endRow 		= maxPodsPerPage;
}

function blankChkHTMLValue(value)
{
	if(trim(value) == ""){ return "&nbsp;";	} else { return value; }
}


function prevClick()
{
	startRow 	= startRow - maxPodsPerPage;
	endRow 		= endRow - maxPodsPerPage;
	loadDashboardPod();
}

function nextClick()
{
	if((startRow + maxPodsPerPage) > dataCntForStage){
		setStartEndRows();
	} else {
		startRow 	= startRow + maxPodsPerPage;
		endRow 		= endRow + maxPodsPerPage;
	}
	
	loadDashboardPod();
}

function autoRefreshData()
{
	var isAutoRefreshReqd 	= trim(document.frmConsolidationDashboard.hAutoRefresh.value);
	var scrollTimeSec	 	= trim(document.frmConsolidationDashboard.hScrollTimeSec.value);
	var scrollMilliSec		= 0;
	
	if(isAutoRefreshReqd == "Y" && scrollTimeSec != "" && parseInt(scrollTimeSec) > 0)
	{
		scrollMilliSec = parseInt(scrollTimeSec) * 1000;
		setTimeout("callAutoRefreshData()",scrollMilliSec);
	}
}

function callAutoRefreshData()
{
	if(doAutoRefresh)
	{
		if((startRow + maxPodsPerPage) > dataCntForStage){
			setStartEndRows();
		} else {
			startRow 	= startRow + maxPodsPerPage;
			endRow 		= endRow + maxPodsPerPage;
		}
		triggerAjaxCall(true,false);
	}
}

function stopAutoRefresh()
{
	doAutoRefresh = false;
	$("#btnStartAutoRefresh").removeAttr("disabled");
	$("#btnStopAutoRefresh").attr("disabled","disabled");
}

function startAutoRefresh()
{
	doAutoRefresh = true;
	$("#btnStopAutoRefresh").removeAttr("disabled");
	$("#btnStartAutoRefresh").attr("disabled","disabled");
	autoRefreshData();
}

function setAutoRefreshFlag()
{
	var isAutoRefreshReqd 	= trim(document.frmConsolidationDashboard.hAutoRefresh.value);
	var scrollTimeSec	 	= trim(document.frmConsolidationDashboard.hScrollTimeSec.value);
	
	if(isAutoRefreshReqd == "Y" && scrollTimeSec != "" && parseInt(scrollTimeSec) > 0){
		doAutoRefresh = true;
		$("#btnStopAutoRefresh").removeAttr("disabled");
	} else {
		doAutoRefresh = false;
	}
}


function setNavigationProperties()
{
	if((startRow - maxPodsPerPage) > 0)
	{
		$("#pgNavPrev").removeAttr("disabled");	
	} 
	else 
	{
		$("#pgNavPrev").attr("disabled","disabled");
	}
	
	if((startRow + maxPodsPerPage) > dataCntForStage)
	{
		//setStartEndRows();
		//$("#pgNavNext").attr("disabled","disabled");
	}
	else
	{
		$("#pgNavNext").removeAttr("disabled");
	}
}


function getDivCss(stgCarton,totCarton)
{
	try
	{
		var stgCartData = trim(stgCarton);
		var totCartData = trim(totCarton);
		var stgCartVal 	= 0;
		var totCartVal 	= 0;
		
		if(stgCartData != "")
		{
			stgCartVal = parseInt(stgCartData);
			if(isNaN(stgCartVal)){
				stgCartVal = 0;
			}
		}
		if(totCartData != "")
		{
			totCartVal = parseInt(totCartData);
			if(isNaN(totCartVal)){
				totCartVal = 0;
			}
		}
		
		if((stgCartData == 0) && (totCartData == 0))
		{
			return "noData";
		}
		else if(stgCartData == totCartData)
		{
			return "dataMatch";
		}
		else
		{
			return "dataNotMatch";
		}
	}
	catch(e)
	{
		alert(e);
	}
}


function doRefresh()
{
	document.frmConsolidationDashboard.method = "post";
	document.frmConsolidationDashboard.action  =  ajaxURL;
	document.frmConsolidationDashboard.submit();
}

function setCSSProp()
{
	var totalRowsInLane = $("#laneMainTbl > tbody > tr").length;
	var spaceCounter = 0;
	
	if(parseInt(totalRowsInLane) >= 4) {
		spaceCounter = Math.round(parseInt(totalRowsInLane)/3) * 20;
	}
	
	var maxPodHeight = DEF_POD_HEIGHT;
	if(MAX_COLS > MAX_DEF_DESIGN_PODS){
		maxPodHeight = REV_POD_HEIGHT; 
	}
		
	var setHeight = ((parseInt(totalRowsInLane)/2) * (maxPodHeight + 30) ) + spaceCounter;
	
	$("#partitionTDId").removeAttr("rowspan");
	$("#partitionTDId").attr("rowspan",totalRowsInLane);
	$("#partitionDivId").css({'height': setHeight + "px"});
}

function setMaxDefaultDesignPods()
{
	var defData = trim(document.frmConsolidationDashboard.hMaxDefDesignPodCnt.value);
	MAX_DEF_DESIGN_PODS = (defData != "") ? parseInt(defData) : 6;  
}

$(document).ready(function() 
{
	setMaxPodsPerPage();
	setStartEndRows();
	setMaxDefaultDesignPods();
	triggerAjaxCall(false,false);
	setAutoRefreshFlag();
	autoRefreshData();
});