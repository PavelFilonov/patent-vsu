package com.vsu.patent.conf.security;

import io.tesler.api.service.session.TeslerAuthenticationService;
import io.tesler.core.util.session.CustomBasicAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.context.request.RequestContextListener;


@RequiredArgsConstructor
@EnableWebSecurity
@Order(100)
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final TeslerAuthenticationService teslerAuthenticationService;

	private final LogoutSuccessHandler logoutSuccessHandler;

	@Bean
	@ConditionalOnMissingBean(LogoutSuccessHandler.class)
	public static LogoutSuccessHandler logoutSuccessHandler() {
		return new HttpStatusReturningLogoutSuccessHandler();
	}

	@Bean
	public StrictHttpFirewall httpFirewall() {
		StrictHttpFirewall strictHttpFirewall = new StrictHttpFirewall();
		strictHttpFirewall.setAllowUrlEncodedSlash(true);
		strictHttpFirewall.setAllowUrlEncodedPercent(true);
		return strictHttpFirewall;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.cors();
		http.authorizeRequests()
				.antMatchers("/**").permitAll();
//				.antMatchers("/rest/**").permitAll()
//				.antMatchers("/css/**").permitAll()
//				.antMatchers("/favicon.ico").permitAll()
//				.antMatchers("/api/v1/rest/**").permitAll()
//				.antMatchers("/api/v1/files/**").permitAll()
//				.antMatchers("/api/v1/auth/**").permitAll()
//				.antMatchers("/api/v1/bc-registry/**").permitAll()
//				.antMatchers("/**").authenticated();
		http.logout()
				.invalidateHttpSession(true)
				.logoutUrl("/api/v1/logout")
				.logoutSuccessHandler(logoutSuccessHandler);
		http.headers().frameOptions().sameOrigin();
		http.httpBasic().authenticationEntryPoint(customBasicAuthenticationEntryPoint());
	}

	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder.userDetailsService(teslerAuthenticationService);
	}

	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public BasicAuthenticationEntryPoint customBasicAuthenticationEntryPoint() {
		return new CustomBasicAuthenticationEntryPoint("CustomRealm");
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	public RequestContextListener requestContextListener() {
		return new RequestContextListener();
	}

}
