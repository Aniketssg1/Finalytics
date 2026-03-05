package com.futurebank.accountService.controller;

import com.futurebank.accountService.model.Account;
import com.futurebank.accountService.model.AccountCreationRequest;
import com.futurebank.accountService.model.Transaction;
import com.futurebank.accountService.model.TransferRequest;
import com.futurebank.accountService.service.AccountService;
import com.futurebank.accountService.service.TransactionService;
import com.futurebank.accountService.service.TransferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    private final AccountService accountService;
    private final TransactionService transactionService;
    private final TransferService transferService;

    public AccountController(AccountService accountService, TransactionService transactionService,
            TransferService transferService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody AccountCreationRequest request) {
        Account account = accountService.createAccount(request.getUserId(), request.getAccountType());
        return new ResponseEntity<>(account, HttpStatus.CREATED);
    }

    @GetMapping("/balance/{accountId}")
    public ResponseEntity<Object> getAccountBalance(@PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account.getBalance());
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long accountId,
            @Valid @RequestBody Account accountDetails) {
        Account updatedAccount = accountService.updateAccount(accountId, accountDetails);
        return ResponseEntity.ok(updatedAccount);
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/transfers")
    public ResponseEntity<Transaction> transferFunds(@Valid @RequestBody TransferRequest transferRequest) {
        Transaction transaction = transferService.transferFunds(
                transferRequest.getFromAccount(),
                transferRequest.getToAccount(),
                transferRequest.getAmount(),
                transferRequest.getCategory());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(
            @PathVariable Long accountId,
            @RequestParam Optional<Integer> year,
            @RequestParam Optional<Integer> month,
            @RequestParam Optional<String> startDate,
            @RequestParam Optional<String> endDate) {

        List<Transaction> transactions = transactionService.determineTransactionQuery(accountId, year, month, startDate,
                endDate);
        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }
}
