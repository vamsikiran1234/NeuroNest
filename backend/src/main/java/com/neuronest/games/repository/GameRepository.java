package com.neuronest.games.repository;

import com.neuronest.games.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, String> {
    List<Game> findByActiveTrue();
    List<Game> findByCategoryIdAndActiveTrue(String categoryId);
}
