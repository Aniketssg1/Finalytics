package com.futurebank.accountService.service;

import com.futurebank.accountService.exception.ResourceNotFoundException;
import com.futurebank.accountService.model.Account;
import com.futurebank.accountService.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountServiceImpl implements AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public Account createAccount(Long userId, String accountType) {
        logger.info("Creating account for userId: {}, type: {}", userId, accountType);

        Account account = new Account();
        account.setUserId(userId);
        account.setAccountType(accountType);
        account.setBalance(BigDecimal.ZERO);
        account.setAccountNumber(generateUniqueAccountNumber());

        Account savedAccount = accountRepository.save(account);
        logger.info("Account created successfully: {}", savedAccount.getAccountNumber());
        return savedAccount;
    }

    /**
     * Generates a unique 10-digit account number.
     * Uses ThreadLocalRandom for thread-safe random number generation
     * instead of System.currentTimeMillis() which could produce duplicates.
     */
    private Long generateUniqueAccountNumber() {
        Long accountNumber;
        int maxAttempts = 100;
        int attempts = 0;
        do {
            accountNumber = ThreadLocalRandom.current().nextLong(1_000_000_000L, 9_999_999_999L);
            attempts++;
            if (attempts >= maxAttempts) {
                throw new RuntimeException(
                        "Failed to generate unique account number after " + maxAttempts + " attempts");
            }
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    @Override
    @Transactional
    public Account updateAccount(Long accountId, Account accountDetails) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        if (accountDetails.getAccountType() != null) {
            account.setAccountType(accountDetails.getAccountType());
        }

        return accountRepository.save(account);
    }

    @Override
    public BigDecimal getAccountBalance(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));
        return account.getBalance();
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));
    }

    @Override
    @Transactional
    public boolean deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));
        accountRepository.delete(account);
        logger.info("Account deleted: {}", accountId);
        return true;
    }
}
