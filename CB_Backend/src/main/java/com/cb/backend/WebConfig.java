package com.cb.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for CORS (Cross-Origin Resource Sharing).
 *
 * <p>
 * Defines allowed origins, HTTP methods, headers, and credentials for API and file endpoints.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    /**
     * Configures CORS mappings for API and file endpoints.
     *
     * @param registry the {@link CorsRegistry} to configure
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
        
        registry.addMapping("/api/files/**")
		        .allowedOrigins("http://localhost:5173", "http://localhost:5174")
		        .allowedMethods("GET", "POST")
		        .allowedHeaders("*")
		        .allowCredentials(true);
    }
}
