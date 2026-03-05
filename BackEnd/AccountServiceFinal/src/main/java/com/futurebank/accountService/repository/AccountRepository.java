package com.futurebank.accountService.repository;

import com.futurebank.accountService.model.Account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountNumber(Long accountNumber);

    Optional<Account> findByAccountNumber(Long accountNumber);
}
