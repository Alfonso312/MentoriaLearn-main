package com.mentoria.controller;

import com.mentoria.model.Inscripcion;
import com.mentoria.repository.InscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inscripciones")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class InscripcionController {
    @Autowired
    private InscripcionRepository inscripcionRepository;

    @GetMapping
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    }

    @PostMapping
    public Inscripcion createInscripcion(@RequestBody Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    @DeleteMapping("/{id}")
    public void deleteInscripcion(@PathVariable Long id) {
        inscripcionRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Inscripcion updateInscripcion(@PathVariable Long id, @RequestBody Inscripcion inscripcionDetails) {
        Inscripcion inscripcion = inscripcionRepository.findById(id).orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
        inscripcion.setEstudiante(inscripcionDetails.getEstudiante());
        inscripcion.setCurso(inscripcionDetails.getCurso());
        return inscripcionRepository.save(inscripcion);
    }
} 