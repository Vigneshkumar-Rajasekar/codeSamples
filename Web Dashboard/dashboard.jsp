
<HTML>

<%@ page language="java" import="java.net.URLEncoder"%>

<%@ include file="/scm/dms/common/constant.jsp" %>
<%@ taglib uri="/WEB-INF/lib/elite-taglibs.jar" prefix="elite-taglibs"%>



<HEAD>
	<TITLE>Dashboard</TITLE>
	
	
	<LINK href="stylesheet.css" rel="stylesheet">
	<link href="dashboard/css/bootstrap.min.css" rel="stylesheet">
	<link href="dashboard/css/ui-bootstrap-custom-1.3.1-csp.css" rel="stylesheet">
	
	<%-- <SCRIPT language="javascript" src="dashboard/scripts/ui-bootstrap-custom-1.3.1.min.js"></SCRIPT>
	<SCRIPT language="javascript" src="dashboard/scripts/ui-bootstrap-custom-tpls-1.3.1.min.js"></SCRIPT> --%>

</HEAD>


	<jsp:useBean id="cmbStageGrpId"			scope="request" class="java.util.Vector"/>
	<jsp:useBean id="dbMode"           		scope="request" class="java.lang.String"/>
	<jsp:useBean id="maxRowLine" 			scope="request" class="java.lang.String" />
	<jsp:useBean id="maxColPerRowLine" 		scope="request" class="java.lang.String" />
	<jsp:useBean id="autoRefresh" 			scope="request" class="java.lang.String" />
	<jsp:useBean id="scrollTime" 			scope="request" class="java.lang.String" />
	<jsp:useBean id="partitionColumn" 		scope="request" class="java.lang.String" />
	<jsp:useBean id="maxDefDesignPodCnt" 	scope="request" class="java.lang.String" />
	<jsp:useBean id="executedTimestamp" 	scope="request" class="java.lang.String" />
	

<%= "<LINK rel=STYLESHEET href='" + styleSheetPath + "stylesheet.css'>" %>

<%="<SCRIPT language = 'javascript' src = '" + BaseConstant.BASE_SCRIPT_COMMON_URL + "stkgenfunctions.js'></SCRIPT>" %>

<link href="dashboard/css/font-awesome.min.css" rel="stylesheet">
<link href="dashboard/css/dashboard.css" rel="stylesheet">



<SCRIPT language="JavaScript" SRC="dashboard.js"></SCRIPT>
    
   

<BODY  onKeyUp="gridKeyEventHandler('tblgrid');" class = clsBody marginwidth = 0 marginheight = 0 leftmargin=0 topmargin=0 rightmargin=0>


<FORM name="frmConsolidationDashboard"><SCRIPT>
    onerror=STKClientErrorHandler;
</SCRIPT>

<input type="hidden" name="hAppId" 				value="<%=appID%>">
<INPUT type='hidden' name="hUserGroup"			value="<%=userGrp%>">
<INPUT type='hidden' name="hFilterControls"		value="<%=lblfiltercontrols%>">

<INPUT type='hidden' name="hMaxRow"				value="<%=maxRowLine%>">
<INPUT type='hidden' name="hMaxColPerRow"		value="<%=maxColPerRowLine%>">
<INPUT type='hidden' name="hAutoRefresh"		value="<%=autoRefresh%>">
<INPUT type='hidden' name="hScrollTimeSec"		value="<%=scrollTime%>">
<INPUT type='hidden' name="hExecutedTimestamp"	value="<%=executedTimestamp%>">
<INPUT type='hidden' name="hPartitionColumn"	value="<%=partitionColumn%>">
<INPUT type='hidden' name="hMaxDefDesignPodCnt"	value="<%=maxDefDesignPodCnt%>">



<TABLE align = "center" width = "100%" border = "0">
	<TR>
	<TD>
	<div class="col-lg-12" id="titleDiv">
		<TABLE class = "breadcrumb titleBar" width = "100%" border = "0">
			<TR>
			<TD>
			<TABLE align = "left">
			<TR>
				<TD> <IMG SRC="<%=Constant.CMN_IMAGES_URL%>logo.png" ALT="ELITE" WIDTH="250" HEIGHT="77" BORDER="0"> </TD>
			</TR>
			</TABLE>
			</TD>
			<TD>
			<TABLE align = "right">
				<TR>
					<TD> <FONT style="font-size: 13px; font-family: cursive;">
							<label title="<fmt:message key='lblstagegrpid' bundle='${elitebundle}'/>"> <fmt:message key="lblstagegrpid" bundle="${elitebundle}" /></label>
							<!-- <label title="Stage Group Id">Stage Group Id</label> -->
						</FONT>
						&nbsp;
					</TD>
					
					<TD align="right"> <button type="button" class="btn btn-success fa fa-refresh" onclick="doRefresh();"></button> &nbsp; </TD>
					<TD align="right"> <button type="button" onclick="prevClick()"  id="pgNavPrev" class="btn btn-danger fa fa-backward" title="<fmt:message key='lbltipbtnnext' bundle='${elitebundle}'/>" ></button> &nbsp; </TD>
					<TD align="right"> <button type="button" onclick="nextClick()" id="pgNavNext" class="btn btn-danger fa fa-forward" title="<fmt:message key='lbltipbtnprevious' bundle='${elitebundle}'/>" ></button> &nbsp; </TD>
					<TD align="right"> <button id = "btnStartAutoRefresh" type = "button" class="btn btn-success fa fa-play" onclick="startAutoRefresh();" disabled="disabled"></button> &nbsp; </TD>
					<TD align="right"> <button id = "btnStopAutoRefresh" type = "button" class="btn btn-danger fa fa-stop" onclick="stopAutoRefresh();" disabled="disabled"></button> &nbsp; </TD>
					<TD align="right"> <i class="fa fa-2x fa-clock-o" style="color:#5cb85c;"></i> </TD>
					<TD align="right"> <span class="time" id = "execTime"><%=executedTimestamp%></span> &nbsp;</TD>
				</TR>
			</TABLE>
		</TD>
			</TR>
		</TABLE>
		</div>
	</TD>
	</TR>
</TABLE>


<TABLE id = "mainTbl" align = "center" width = "80%" border = "0">
	<TR>
		<TD>
			<DIV id = "sliderDiv"><TABLE id = "laneMainTbl" align = "center" border = "0"> </TABLE></DIV>
		</TD>
	</TR>
</TABLE>
</FORM>
</BODY>


<script>


</script>

</HTML>
