package com.mentoria.config;

import com.mentoria.model.Usuario;
import com.mentoria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Usuario Administrador
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setEmail("admin@mentoria.com");
            admin.setRole("ADMIN");
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado: admin/admin");
        }

        // Usuario Mentor
        if (usuarioRepository.findByUsername("mentor1").isEmpty()) {
            Usuario mentor = new Usuario();
            mentor.setUsername("mentor1");
            mentor.setPassword(passwordEncoder.encode("mentor123"));
            mentor.setEmail("mentor1@mentoria.com");
            mentor.setRole("MENTOR");
            usuarioRepository.save(mentor);
            System.out.println("Usuario mentor creado: mentor1/mentor123");
        }

        // Usuario Estudiante
        if (usuarioRepository.findByUsername("estudiante1").isEmpty()) {
            Usuario estudiante = new Usuario();
            estudiante.setUsername("estudiante1");
            estudiante.setPassword(passwordEncoder.encode("estudiante123"));
            estudiante.setEmail("estudiante1@mentoria.com");
            estudiante.setRole("USER");
            usuarioRepository.save(estudiante);
            System.out.println("Usuario estudiante creado: estudiante1/estudiante123");
        }
        
        System.out.println("Inicialización de datos completada.");
    }
} 