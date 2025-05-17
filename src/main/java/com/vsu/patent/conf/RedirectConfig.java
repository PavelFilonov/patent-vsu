package com.vsu.patent.conf;

import io.tesler.core.controller.http.StaticRedirectFilter;
import javax.servlet.Filter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;

@EnableWebSecurity
@Order(1)
@Configuration
public class RedirectConfig extends WebSecurityConfigurerAdapter {

	@Value("${app.ui-path}")
	String uiPath;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
			.requestMatchers()
				.antMatchers("/").and()
				.addFilterBefore(defaultUrlFilter(), ChannelProcessingFilter.class)
			.authorizeRequests()
				.antMatchers("/").permitAll();
		// @formatter:on
	}

	private Filter defaultUrlFilter() {
		return new StaticRedirectFilter(String.format("%s/", uiPath));
	}

}
