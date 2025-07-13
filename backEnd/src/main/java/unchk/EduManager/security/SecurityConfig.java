package unchk.EduManager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.validation.annotation.Validated;

import lombok.RequiredArgsConstructor;
import unchk.EduManager.jwtToken.JwtFilter;
import unchk.EduManager.jwtToken.JwtUtils;
import unchk.EduManager.service.UserService;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
        private final UserService userService;
        private final JwtUtils jwtUtils;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder)
                        throws Exception {
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);
                authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(passwordEncoder);
                return authenticationManagerBuilder.build();
        }

        @Bean
        @Validated
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                // System.out.println("securityFilterChain");
                return http
                                .csrf(csrfConfig -> // Disable CSRF for simplicity, not recommended for production
                                csrfConfig.disable())
                                .authorizeHttpRequests(
                                                auth -> auth.requestMatchers("/auth/**")
                                                                .permitAll()
                                                                .anyRequest().authenticated())
                                .addFilterBefore(new JwtFilter(userService, jwtUtils),
                                                UsernamePasswordAuthenticationFilter.class)
                                .build();
        }
}
