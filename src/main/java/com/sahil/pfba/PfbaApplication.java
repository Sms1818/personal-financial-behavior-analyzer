package com.sahil.pfba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
@EnableAsync
public class PfbaApplication {

    public static void main(String[] args) {
        SpringApplication.run(PfbaApplication.class, args);
    }
}
