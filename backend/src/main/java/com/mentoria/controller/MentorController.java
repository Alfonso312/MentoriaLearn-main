package com.mentoria.controller;

import com.mentoria.model.Estudiante;
import com.mentoria.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mentores")
public class MentorController {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping("/estudiantes")
    public List<Estudiante> getAllEstudiantes() {
        return estudianteRepository.findAll();
    }
} 