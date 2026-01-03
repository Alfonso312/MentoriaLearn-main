package com.mentoria.controller;

import com.mentoria.model.Usuario;
import com.mentoria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        return usuarioRepository.findByUsername(username)
                .filter(usuario -> passwordEncoder.matches(password, usuario.getPassword()))
                .map(usuario -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Login exitoso");
                    response.put("user", Map.of(
                        "id", usuario.getId(),
                        "username", usuario.getUsername(),
                        "email", usuario.getEmail(),
                        "role", usuario.getRole()
                    ));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Credenciales inválidas"
                )));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El nombre de usuario ya existe"
            ));
        }

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "El email ya está registrado"
            ));
        }

        // Codificar la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Por defecto, asignar rol USER si no se especifica
        if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
            usuario.setRole("USER");
        }

        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuario registrado exitosamente");
        response.put("user", Map.of(
            "id", savedUsuario.getId(),
            "username", savedUsuario.getUsername(),
            "email", savedUsuario.getEmail(),
            "role", savedUsuario.getRole()
        ));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth() {
        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "message", "Sistema de autenticación funcionando"
        ));
    }

    @GetMapping("/users/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            List<Usuario> usuarios = usuarioRepository.findByRole(role);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error al obtener usuarios: " + e.getMessage()
            ));
        }
    }
} 