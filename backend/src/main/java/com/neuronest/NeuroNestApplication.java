package com.neuronest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class NeuroNestApplication {

    public static void main(String[] args) {
        SpringApplication.run(NeuroNestApplication.class, args);
    }
}
