package com.cg.services;

import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@RunWith(SpringJUnit4ClassRunner.class)
public class AppServiceTest {
	
	private MockMvc mockMvc;
	
	@InjectMocks
	private AppService appService;
	
	@Before
	public void setUp() throws Exception {
		mockMvc = MockMvcBuilders.standaloneSetup(appService).build();
	}
	
	@Test
	public void appServiceTest() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/welcome")
		).andExpect(MockMvcResultMatchers.status().isOk())
		.andExpect(MockMvcResultMatchers.content().string("Cognitivity"));
	}
	
	@Test
	public void jsonAppServiceTest() throws Exception{
		mockMvc.perform( MockMvcRequestBuilders.get("/json").accept(MediaType.APPLICATION_JSON)
				).andExpect(MockMvcResultMatchers.status().isOk())
		.andExpect(MockMvcResultMatchers.jsonPath("$.empId", Matchers.is("E10101")))
		.andExpect(MockMvcResultMatchers.jsonPath("$.empName", Matchers.is("Vignesh")));
		
	}
}
