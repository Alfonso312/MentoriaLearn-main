package com.mentoria.controller;

import com.mentoria.model.Curso;
import com.mentoria.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
public class CursoController {
    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping
    public List<Curso> getAllCursos() {
        return cursoRepository.findAll();
    }

    @PostMapping
    public Curso createCurso(@RequestBody Curso curso) {
        return cursoRepository.save(curso);
    }

    @PutMapping("/{id}")
    public Curso updateCurso(@PathVariable Long id, @RequestBody Curso cursoDetails) {
        Curso curso = cursoRepository.findById(id).orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        curso.setTitulo(cursoDetails.getTitulo());
        curso.setDescripcion(cursoDetails.getDescripcion());
        curso.setNivel(cursoDetails.getNivel());
        curso.setMentor(cursoDetails.getMentor());
        curso.setHorarios(cursoDetails.getHorarios());
        return cursoRepository.save(curso);
    }
} 