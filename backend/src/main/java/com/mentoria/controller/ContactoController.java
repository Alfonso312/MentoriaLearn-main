package com.mentoria.controller;

import com.mentoria.model.Contacto;
import com.mentoria.repository.ContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class ContactoController {

    @Autowired
    private ContactoRepository contactoRepository;

    @PostMapping
    public ResponseEntity<?> enviarMensaje(@RequestBody Contacto contacto) {
        try {
            Contacto savedContacto = contactoRepository.save(contacto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mensaje enviado exitosamente");
            response.put("id", savedContacto.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al enviar el mensaje: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public List<Contacto> getAllMensajes() {
        return contactoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contacto> getMensajeById(@PathVariable Long id) {
        return contactoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMensaje(@PathVariable Long id) {
        return contactoRepository.findById(id)
                .map(contacto -> {
                    contactoRepository.delete(contacto);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 