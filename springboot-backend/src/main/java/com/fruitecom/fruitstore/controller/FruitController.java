package com.fruitecom.fruitstore.controller;

import com.fruitecom.fruitstore.model.Fruit;
import com.fruitecom.fruitstore.repository.FruitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class FruitController {

    @Autowired
    private FruitRepository fruitRepository;

    @GetMapping
    public List<Fruit> getAllProducts() {
        return fruitRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fruit> getProductById(@PathVariable Long id) {
        return fruitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Fruit> createProduct(@RequestBody Fruit fruit) {
        Fruit savedFruit = fruitRepository.save(fruit);
        return new ResponseEntity<>(savedFruit, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fruit> updateProduct(@PathVariable Long id, @RequestBody Fruit fruitDetails) {
        return fruitRepository.findById(id).map(fruit -> {
            fruit.setName(fruitDetails.getName());
            fruit.setCategory(fruitDetails.getCategory());
            fruit.setPrice(fruitDetails.getPrice());
            fruit.setUnit(fruitDetails.getUnit());
            fruit.setStock(fruitDetails.getStock());
            fruit.setDescription(fruitDetails.getDescription());
            fruit.setOrigin(fruitDetails.getOrigin());
            fruit.setImage(fruitDetails.getImage());
            Fruit updatedFruit = fruitRepository.save(fruit);
            return ResponseEntity.ok(updatedFruit);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (fruitRepository.existsById(id)) {
            fruitRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
