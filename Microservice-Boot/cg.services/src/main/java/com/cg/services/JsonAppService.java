package com.cg.services;

public class JsonAppService {

	private String empId;
	private String empName;
	
	public JsonAppService() {
		
	}
	
	public JsonAppService(String empId, String empName) {
		this.empId = empId;
		this.empName = empName;
	}
	
	public String getEmpId() {
		return empId;
	}
	public void setEmpId(String empId) {
		this.empId = empId;
	}
	public String getEmpName() {
		return empName;
	}
	public void setEmpName(String empName) {
		this.empName = empName;
	}
	
}
