package com.neuronest.games.repository;

import com.neuronest.games.entity.GameCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameCategoryRepository extends JpaRepository<GameCategory, String> {
    List<GameCategory> findAllByOrderByDisplayOrderAsc();
}
