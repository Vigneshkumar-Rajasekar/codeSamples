package com.cg.services;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppService {

	@GetMapping("/welcome")
	public String appTest() {
		return "Cognitivity";
	}
	
	@GetMapping(value = "/json",produces = MediaType.APPLICATION_JSON_VALUE)
	public JsonAppService jsonAppService() {
		return new JsonAppService("E1010", "Vignesh");
	}
	
	@GetMapping(value = "/json/{userId}",produces = MediaType.APPLICATION_JSON_VALUE)
	public JsonAppService jsonAppServiceArg(@PathVariable("userId") String userId) {
		return new JsonAppService(userId, "Vignesh");
	}
}
