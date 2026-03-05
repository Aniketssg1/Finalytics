package com.futurebank.accountService.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "accounts")
@Getter
@NoArgsConstructor
@ToString(exclude = "balance")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter
    private Long accountNumber;

    @NotNull
    @PositiveOrZero
    private BigDecimal balance = BigDecimal.ZERO;

    @Setter
    private String accountType;

    @Setter
    private Long userId;

    public Account(Long userId, String accountType, BigDecimal initialBalance) {
        this.userId = userId;
        this.accountType = accountType;
        this.balance = initialBalance.compareTo(BigDecimal.ZERO) >= 0 ? initialBalance : BigDecimal.ZERO;
    }

    /**
     * Sets the balance directly. Package-private to restrict usage.
     * Prefer using deposit() and withdraw() for balance changes.
     */
    public void setBalance(BigDecimal balance) {
        if (balance != null && balance.compareTo(BigDecimal.ZERO) >= 0) {
            this.balance = balance;
        }
    }

    public void deposit(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        this.balance = this.balance.add(amount);
    }

    public boolean withdraw(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        if (this.balance.compareTo(amount) >= 0) {
            this.balance = this.balance.subtract(amount);
            return true;
        }
        return false;
    }
}
