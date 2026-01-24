    package com.sahil.pfba.repository;

    import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseId;
import com.sahil.pfba.domain.TransactionType;

    @Repository
    @Profile("prod")
    public interface  ExpenseJPARepository extends JpaRepository<Expense, ExpenseId> {
        @Override
        @Query("""
            select e from Expense e
            where e.status = 'ACTIVE'
            and e.version = (
                select max(e2.version)
                from Expense e2
                where e2.id = e.id
            )
            order by e.createdAt desc
        """)
        List<Expense> findAll();

    @Query("""
        select e from Expense e
        where e.id = :id
        and e.version = (
            select max(e2.version)
            from Expense e2
            where e2.id = :id
        )
    """)
    Optional<Expense> findLatestById(String id);

    @Query("""
        select e from Expense e
        where e.id = :id
        order by e.version asc
    """)
    List<Expense> findHistoryById(String id);

    @Query("""
        select e from Expense e
        where e.category = :category
        and e.status = 'ACTIVE'
        and e.version = (
            select max(e2.version)
            from Expense e2
            where e2.id = e.id
        )
    """)
    List<Expense> findLatestByCategory(Category category);

    @Query("""
        select e from Expense e
        where e.date between :start and :end
        and e.status = 'ACTIVE'
        and e.version = (
            select max(e2.version)
            from Expense e2
            where e2.id = e.id
        )
    """)
    List<Expense> findByDateRange(LocalDate start, LocalDate end);

    @Query("""
        select e from Expense e
        where e.transactionType = :type
        and e.status = 'ACTIVE'
        and e.version = (
            select max(e2.version)
            from Expense e2
            where e2.id = e.id
        )
    """)
    List<Expense> findByType(TransactionType type);

    }
