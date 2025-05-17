package com.vsu.patent.conf.LoggingConfig;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "config.slf4jfilter")
public class LoggingMDCFilterConfiguration {

	public static final String DEFAULT_RESPONSE_TOKEN_HEADER = "Response_Token";
	public static final String DEFAULT_MDC_UUID_TOKEN_KEY = "LoggingMDCFilter.UUID";

	private String responseHeader = DEFAULT_RESPONSE_TOKEN_HEADER;
	private String mdcTokenKey = DEFAULT_MDC_UUID_TOKEN_KEY;
	private String requestHeader = null;

	@Bean
	public FilterRegistrationBean servletRegistrationBean() {
		final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		final LoggingMDCFilter log4jMDCFilterFilter = new LoggingMDCFilter(responseHeader, mdcTokenKey, requestHeader);
		registrationBean.setFilter(log4jMDCFilterFilter);
		registrationBean.setOrder(2);
		return registrationBean;
	}

}
