package com.futurebank.authservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.client.RestTemplate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@Configuration
@ConfigurationProperties(prefix = "app")
@EnableJpaAuditing
public class AppConfig {
    private String jwtSecret;
    private long jwtExpirationMs;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
