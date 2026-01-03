package com.mentoria.controller;

import com.mentoria.model.Estudiante;
import com.mentoria.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class EstudianteController {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping
    public List<Estudiante> getAllEstudiantes() {
        return estudianteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getEstudianteById(@PathVariable Long id) {
        return estudianteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estudiante createEstudiante(@RequestBody Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> updateEstudiante(@PathVariable Long id, @RequestBody Estudiante estudianteDetails) {
        return estudianteRepository.findById(id)
                .map(estudiante -> {
                    estudiante.setNombre(estudianteDetails.getNombre());
                    estudiante.setApellido(estudianteDetails.getApellido());
                    estudiante.setEmail(estudianteDetails.getEmail());
                    estudiante.setGrado(estudianteDetails.getGrado());
                    estudiante.setEscuela(estudianteDetails.getEscuela());
                    estudiante.setTelefono(estudianteDetails.getTelefono());
                    estudiante.setDireccion(estudianteDetails.getDireccion());
                    return ResponseEntity.ok(estudianteRepository.save(estudiante));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstudiante(@PathVariable Long id) {
        return estudianteRepository.findById(id)
                .map(estudiante -> {
                    estudianteRepository.delete(estudiante);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 