package com.mentoria.repository;

import com.mentoria.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    java.util.List<Inscripcion> findByEstudiante(com.mentoria.model.Estudiante estudiante);
}