package com.futurebank.accountService.model;

import org.hibernate.annotations.CreationTimestamp;
import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "fromAccount", "toAccount" })
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "fromAccountId", nullable = false)
    private Account fromAccount;

    @ManyToOne
    @JoinColumn(name = "toAccountId", nullable = false)
    private Account toAccount;

    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MyTransactionCategory category;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDate;

    public Transaction(Account fromAccount, Account toAccount, BigDecimal amount, MyTransactionCategory category) {
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.amount = amount;
        this.category = category;
    }
}
