package com.mentoria.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "message", "MentoriaLearn Backend is running",
                "status", "online",
                "frontend_url", "http://localhost:3000");
    }
}
